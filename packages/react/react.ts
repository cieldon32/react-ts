import { $Shape, $NonMaybeType } from "utility-types";

/**
 * A UI node that can be rendered by React. React can render most primitives in
 * addition to elements and arrays of nodes.
 */
declare type React$Node = 
null | 
boolean | 
number | 
string | 
React.ReactElement<React.ComponentProps<any>, any> | 
React$Portal | 
Iterable<React.ReactNode | null | undefined>;
export type React$TransportValue = void | null | boolean | number | string | React.ReactElement<React.ComponentProps<React.ElementType>, React.ElementType> | ReadonlyArray<React$TransportValue> | React$TransportObject;
export type React$TransportObject = Readonly<Record<string, React$TransportValue>>;

/**
* Base class of ES6 React classes, modeled as a polymorphic class whose main
* type parameters are Props and State.
*/
declare class React$Component<Props, State = void> {
  // fields
  props: Props;
  state: State;
  // action methods
  setState(partialState: ($Shape<State> | null | undefined) | ((arg0: State, arg1: Props) => $Shape<State> | null | undefined), callback?: () => unknown): void;
  forceUpdate(callback?: () => void): void;
  // lifecycle methods
  constructor(props?: Props, context?: any): void;
  render(): React.ReactNode;
  componentWillMount(): unknown;
  UNSAFE_componentWillMount(): unknown;
  componentDidMount(): unknown;
  componentWillReceiveProps(nextProps: Props, nextContext: any): unknown;
  UNSAFE_componentWillReceiveProps(nextProps: Props, nextContext: any): unknown;
  shouldComponentUpdate(nextProps: Props, nextState: State, nextContext: any): boolean;
  componentWillUpdate(nextProps: Props, nextState: State, nextContext: any): unknown;
  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State, nextContext: any): unknown;
  componentDidUpdate(prevProps: Props, prevState: State, prevContext: any): unknown;
  componentWillUnmount(): unknown;
  componentDidCatch(error: Error, info: {
    componentStack: string;
  }): unknown;
  // long tail of other stuff not modeled very well
  refs: any;
  context: any;
  getChildContext(): any;
  displayName?: string | null | undefined;
  childContextTypes: any;
  contextTypes: any;
  propTypes: any; // We don't add a type for `defaultProps` so that its type may be entirely
  // inferred when we diff the type for `defaultProps` with `Props`. Otherwise
  // the user would need to define a type (which would be redundant) to override
  // the type we provide here in the base class.
  //
  // static defaultProps: $Shape<Props>;

}

declare class React$PureComponent<Props, State = void> extends React$Component<Props, State> {
  // TODO: Due to bugs in Flow's handling of React.createClass, some fields
  // already declared in the base class need to be redeclared below. Ideally
  // they should simply be inherited.
  props: Props;
  state: State;
}

/**
* Base class of legacy React classes, which extends the base class of ES6 React
* classes and supports additional methods.
*/
declare class LegacyReactComponent<Props, State> extends React$Component<Props, State> {
  // additional methods
  replaceState(state: State, callback?: () => void): void;
  isMounted(): boolean;
  // TODO: Due to bugs in Flow's handling of React.createClass, some fields
  // already declared in the base class need to be redeclared below. Ideally
  // they should simply be inherited.
  props: Props;
  state: State;
}

declare type React$AbstractComponentStatics = {
  displayName?: string | null | undefined;
  // This is only on function components, but trying to access name when
  // displayName is undefined is a common pattern.
  name?: string | null | undefined;
  propTypes?: Record<string, any>;
};
/**
* The type of a stateless functional component. In most cases these components
* are a single function. However, they may have some static properties that we
* can type check.
*/

declare type React$StatelessFunctionalComponent<Props> = {
  (props: Props, context: any): React.ReactNode;
  displayName?: string | null | undefined;
  propTypes?: any;
  contextTypes?: any;
};
/**
* The type of a component in React. A React component may be a:
*
* - Stateless functional components. Functions that take in props as an
*   argument and return a React node.
* - ES6 class component. Components with state defined either using the ES6
*   class syntax, or with the legacy `React.createClass()` helper.
*/

declare type React$ComponentType<Config> = React$AbstractComponent<Config, unknown>;
/**
* The type of an element in React. A React element may be a:
*
* - String. These elements are intrinsics that depend on the React renderer
*   implementation.
* - React component. See `ComponentType` for more information about its
*   different variants.
*/

declare type React$ElementType = string | React$AbstractComponent<never, unknown>;
/**
* Type of a React element. React elements are commonly created using JSX
* literals, which desugar to React.createElement calls (see below).
*/

declare type React$Element<ElementType extends React.ElementType> = {
  readonly type: ElementType;
  readonly props: React$ElementProps<ElementType>;
  readonly key: React$Key | null;
  readonly ref: any;
};
declare type React$MixedElement = React.ReactElement<React.ComponentProps<React.ElementType>, React.ElementType>;
/**
* The type of the key that React uses to determine where items in a new list
* have moved.
*/

declare type React$Key = string | number;
/**
* The type of the ref prop available on all React components.
*/

declare type React$Ref<ElementType extends React.ElementType> = {
  current: React$ElementRef<ElementType> | null;
} | ((arg0: React$ElementRef<ElementType> | null) => unknown) | number | string;
/**
* The type of a React Context.  React Contexts are created by calling
* createContext() with a default value.
*/

declare type React$Context<T> = {
  Provider: React.ComponentType<{
    value: T;
    children?: React.ReactNode;
  }>;
  Consumer: React.ComponentType<{
    children: (value: T) => React.ReactNode | null | undefined;
  }>;
  // Optional, user-specified value for custom display label in React DevTools.
  displayName?: string;
};
/**
* A React portal node. The implementation of the portal node is hidden to React
* users so we use an opaque type.
*/

declare opaque type React$Portal;
declare type React$FragmentType = (arg0: {
  children?: React.ReactNode;
}) => React.ReactNode;
declare module react {
  export declare var DOM: any;
  export declare var PropTypes: ReactPropTypes;
  export declare var version: string;
  export function checkPropTypes<V>(propTypes: any, values: V, location: string, componentName: string, getStack: (() => string | null | undefined) | null | undefined): void;
  export declare var createClass: React$CreateClass;
  export function createContext<T>(defaultValue: T, calculateChangedBits: ((a: T, b: T) => number) | null | undefined): React.Context<T>;
  export declare var createElement: React$CreateElement;
  export declare var cloneElement: React$CloneElement;
  export function createFactory<ElementType extends React.ElementType>(type: ElementType): React$ElementFactory<ElementType>;
  export function createRef<T>(): {
    current: null | T;
  };
  export function isValidElement(element: any): boolean;
  export declare var Component: typeof React.Component;
  export declare var PureComponent: typeof React$PureComponent;
  export type StatelessFunctionalComponent<P> = React.FC<P>;
  export type ComponentType<P> = React.ComponentType<P>;
  export type AbstractComponent<Config, Instance = unknown> = React$AbstractComponent<Config, Instance>;
  export type MixedElement = React$MixedElement;
  export type ElementType = React.ElementType;
  export type Element<C> = React.ReactElement<React.ComponentProps<C>, C>;
  export declare var Fragment: React$FragmentType;
  export type Key = React$Key;
  export type Ref<C> = React.Ref<C>;
  export type Node = React.ReactNode;
  export type TransportObject = React$TransportObject;
  export type TransportValue = React$TransportValue;
  export type Context<T> = React.Context<T>;
  export type Portal = React$Portal;
  export declare var ConcurrentMode: (arg0: {
    children?: React.ReactNode;
  }) => React.ReactNode; // 16.7+

  export declare var StrictMode: (arg0: {
    children?: React.ReactNode;
  }) => React.ReactNode;
  export declare var Suspense: React.ComponentType<{
    children?: React.ReactNode;
    fallback?: React.ReactNode;
  }>;
  // 16.6+
  export type ElementProps<C> = React$ElementProps<C>;
  export type ElementConfig<C> = React$ElementConfig<C>;
  export type ElementRef<C> = React$ElementRef<C>;
  export type Config<Props, DefaultProps> = React$Config<Props, DefaultProps>;
  export type ChildrenArray<T> = ReadonlyArray<ChildrenArray<T>> | T;
  export declare var Children: {
    map<T, U, This>(children: ChildrenArray<T>, fn: (child: $NonMaybeType<T>, index: number) => U, thisArg: This): Array<$NonMaybeType<U>>;
    forEach<T, This>(children: ChildrenArray<T>, fn: (child: T, index: number) => unknown, thisArg: This): void;
    count(children: ChildrenArray<any>): number;
    only<T>(children: ChildrenArray<T>): $NonMaybeType<T>;
    toArray<T>(children: ChildrenArray<T>): Array<$NonMaybeType<T>>;
  };
  export function forwardRef<Config, Instance>(render: (props: Config, ref: {
    current: null | Instance;
  } | ((arg0: null | Instance) => unknown)) => React.ReactNode): React$AbstractComponent<Config, Instance>;
  export function memo<Config, Instance = unknown>(component: React$AbstractComponent<Config, Instance>, equal?: (arg0: Config, arg1: Config) => boolean): React$AbstractComponent<Config, Instance>;
  export function lazy<Config, Instance = unknown>(component: () => Promise<{
    default: React$AbstractComponent<Config, Instance>;
  }>): React$AbstractComponent<Config, Instance>;
  declare type MaybeCleanUpFn = void | (() => void);
  export function useContext<T>(context: React.Context<T>): T;
  export function useState<S>(initialState: (() => S) | S): [S, (arg0: ((arg0: S) => S) | S) => void];
  declare type Dispatch<A> = (arg0: A) => void;
  export function useReducer<S, A>(reducer: (arg0: S, arg1: A) => S, initialState: S): [S, Dispatch<A>];
  export function useReducer<S, A>(reducer: (arg0: S, arg1: A) => S, initialState: S, init: void): [S, Dispatch<A>];
  export function useReducer<S, A, I>(reducer: (arg0: S, arg1: A) => S, initialArg: I, init: (arg0: I) => S): [S, Dispatch<A>];
  export function useRef<T>(initialValue: T): {
    current: T;
  };
  export function useDebugValue(value: any): void;
  export function useEffect(create: () => MaybeCleanUpFn, inputs?: ReadonlyArray<unknown> | null | undefined): void;
  export function useLayoutEffect(create: () => MaybeCleanUpFn, inputs?: ReadonlyArray<unknown> | null | undefined): void;
  export function useCallback<T extends (...args: ReadonlyArray<never>) => unknown>(callback: T, inputs: ReadonlyArray<unknown> | null | undefined): T;
  export function useMemo<T>(create: () => T, inputs: ReadonlyArray<unknown> | null | undefined): T;
  export function useImperativeHandle<T>(ref: {
    current: T | null;
  } | ((inst: T | null) => unknown) | null | void, create: () => T, inputs: ReadonlyArray<unknown> | null | undefined): void;
  export function useDeferredValue<T>(value: T): T;
  export function useTransition(): [boolean, (arg0: () => void) => void];
  export function startTransition(arg0: () => void): void;
  export type Interaction = {
    name: string;
    timestamp: number;
  };
  declare type ProfilerOnRenderFnType = (id: string, phase: "mount" | "update", actualDuration: number, baseDuration: number, startTime: number, commitTime: number, interactions: Set<Interaction>) => void;
  export declare var Profiler: React$AbstractComponent<{
    children?: React.ReactNode;
    id: string;
    onRender: ProfilerOnRenderFnType;
  }, void>;
  declare type TimeoutConfig = {
    timeoutMs: number;
  };
  export default {
    readonly DOM: typeof DOM;
    readonly PropTypes: typeof PropTypes;
    readonly version: typeof version;
    readonly checkPropTypes: typeof checkPropTypes;
    readonly memo: typeof memo;
    readonly lazy: typeof lazy;
    readonly createClass: typeof createClass;
    readonly createContext: typeof createContext;
    readonly createElement: typeof createElement;
    readonly cloneElement: typeof cloneElement;
    readonly createFactory: typeof createFactory;
    readonly createRef: typeof createRef;
    readonly forwardRef: typeof forwardRef;
    readonly isValidElement: typeof isValidElement;
    readonly Component: typeof Component;
    readonly PureComponent: typeof PureComponent;
    readonly Fragment: React$FragmentType;
    readonly Children: typeof Children;
    readonly ConcurrentMode: typeof ConcurrentMode;
    readonly StrictMode: typeof StrictMode;
    readonly Profiler: typeof Profiler;
    readonly Suspense: typeof Suspense;
    readonly useContext: typeof useContext;
    readonly useState: typeof useState;
    readonly useReducer: typeof useReducer;
    readonly useRef: typeof useRef;
    readonly useEffect: typeof useEffect;
    readonly useLayoutEffect: typeof useLayoutEffect;
    readonly useCallback: typeof useCallback;
    readonly useMemo: typeof useMemo;
    readonly useImperativeHandle: typeof useImperativeHandle;
    readonly useTransition: typeof useTransition;
    readonly useDeferredValue: typeof useDeferredValue;
    readonly startTransition: typeof startTransition;
  };
} // TODO Delete this once https://github.com/facebook/react/pull/3031 lands
// and "react" becomes the standard name for this module

declare module React {
  declare module.exports: $Exports<"react">
}
type ReactPropsCheckType = (props: any, propName: string, componentName: string, href?: string) => Error | null | undefined;
type ReactPropsChainableTypeChecker = {
  (props: any, propName: string, componentName: string, href?: string): Error | null | undefined;
  isRequired: ReactPropsCheckType;
};
type React$PropTypes$arrayOf = (typeChecker: ReactPropsCheckType) => ReactPropsChainableTypeChecker;
type React$PropTypes$instanceOf = (expectedClass: any) => ReactPropsChainableTypeChecker;
type React$PropTypes$objectOf = (typeChecker: ReactPropsCheckType) => ReactPropsChainableTypeChecker;
type React$PropTypes$oneOf = (expectedValues: Array<any>) => ReactPropsChainableTypeChecker;
type React$PropTypes$oneOfType = (arrayOfTypeCheckers: Array<ReactPropsCheckType>) => ReactPropsChainableTypeChecker;
type React$PropTypes$shape = (shapeTypes: Record<string, ReactPropsCheckType>) => ReactPropsChainableTypeChecker;
type ReactPropTypes = {
  array: React$PropType$Primitive<Array<any>>;
  bool: React$PropType$Primitive<boolean>;
  func: React$PropType$Primitive<(...args: Array<any>) => any>;
  number: React$PropType$Primitive<number>;
  object: React$PropType$Primitive<Record<string, any>>;
  string: React$PropType$Primitive<string>;
  any: React$PropType$Primitive<any>;
  arrayOf: React$PropType$ArrayOf;
  element: React$PropType$Primitive<any>;

  /* TODO */
  instanceOf: React$PropType$InstanceOf;
  node: React$PropType$Primitive<any>;

  /* TODO */
  objectOf: React$PropType$ObjectOf;
  oneOf: React$PropType$OneOf;
  oneOfType: React$PropType$OneOfType;
  shape: React$PropType$Shape;
};
declare module '#flow-internal-react-server-module' {
  export declare var createElement: React$CreateElement;
  export type Node = React.ReactNode;
  export default {
    readonly createElement: typeof createElement;
  };
}