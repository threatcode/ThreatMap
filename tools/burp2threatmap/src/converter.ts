import { existsSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { type BurpItem, decodeBody, parseBurpTime } from "./burp.js";

export class Converter {
  private readonly db: DatabaseSync;

  constructor(projectPath: string) {
    const dbPath = path.join(projectPath, "database.threatmap");
    if (!existsSync(dbPath)) {
      throw new Error("ThreatMap main database does not exist");
    }
    this.db = new DatabaseSync(dbPath);

    const rawPath = path.join(projectPath, "database_raw.threatmap");
    this.db.exec(`ATTACH DATABASE '${rawPath.replace(/'/g, "''")}' AS raw`);
  }

  close(): void {
    this.db.close();
  }

  convertItem(item: BurpItem): void {
    const timestamp = parseBurpTime(item.time);
    const responseData = decodeBody(item.response, item.responseBase64);
    const requestData = decodeBody(item.request, item.requestBase64);

    const rawResponse = this.db
      .prepare(
        "INSERT INTO raw.responses_raw (data, source, alteration) VALUES (?, 'intercept', 'none') RETURNING id",
      )
      .get(responseData) as { id: number };

    const response = this.db
      .prepare(
        "INSERT INTO responses (status_code, raw_id, length, alteration, edited, roundtrip_time, created_at) VALUES (?, ?, ?, 'none', 0, 0, ?) RETURNING id",
      )
      .get(item.status, rawResponse.id, item.responseLength, timestamp) as {
      id: number;
    };

    const rawRequest = this.db
      .prepare(
        "INSERT INTO raw.requests_raw (data, source, alteration) VALUES (?, 'intercept', 'none') RETURNING id",
      )
      .get(requestData) as { id: number };

    const metadata = this.db
      .prepare("INSERT INTO requests_metadata DEFAULT VALUES RETURNING id")
      .get() as { id: number };

    const request = this.db
      .prepare(
        "INSERT INTO requests (host, method, path, length, port, is_tls, raw_id, query, response_id, source, created_at, metadata_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'intercept', ?, ?) RETURNING id",
      )
      .get(
        item.host,
        item.method,
        item.path,
        requestData.length,
        item.port,
        item.protocol === "https" ? 1 : 0,
        rawRequest.id,
        "",
        response.id,
        timestamp,
        metadata.id,
      ) as { id: number };

    this.db
      .prepare("INSERT INTO intercept_entries (request_id) VALUES (?)")
      .run(request.id);
  }
}
