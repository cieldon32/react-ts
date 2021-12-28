declare namespace React {
  type ComponentProps<K = any, T = any> = any;
  type ReactNode<K = any, T = any> = any;
  type ReactElement<K = any, T = any> = any;
}

declare type Fiber = any;

declare module 'react';
declare module 'react/src/ReactLazy' {
  export type LazyComponent<K = any, T = any> = any;
}

declare module 'ReactFbErrorUtils';
declare module 'ReactNativeInternalFeatureFlags';
