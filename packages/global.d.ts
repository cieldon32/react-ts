// Global compile-time constants
declare var __DEV__: boolean;
declare var __TEST__: boolean;
declare var __BROWSER__: boolean;
declare var __GLOBAL__: boolean;
declare var __ESM_BUNDLER__: boolean;
declare var __ESM_BROWSER__: boolean;
declare var __NODE_JS__: boolean;
declare var __VERSION__: string;
declare var __PROFILE__: string;
declare var __EXPERIMENTAL__: string;
declare var __VARIANT__: string;

// React Devtools
declare var __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown;

// Overwrite
declare interface String {
  /**
   * @deprecated Please use String.prototype.slice instead of String.prototype.substring in the repository.
   */
  substring(start: number, end?: number): string;
}
