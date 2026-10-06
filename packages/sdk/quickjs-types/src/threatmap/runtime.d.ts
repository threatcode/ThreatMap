declare module "threatmap:utils" {
  /**
   * The SDK for the runtime information.
   * @category Runtime
   */
  export type RuntimeSDK = {
    /**
     * Get the current version of Threatmap.
     */
    get version(): string;
  };
}
