import type { Source } from "shared/ReactElementType";
import type { RefObject, ReactContext, MutableSourceSubscribeFn, MutableSourceGetSnapshotFn, MutableSourceVersion, MutableSource } from "shared/ReactTypes";
import type { SuspenseInstance } from "./ReactFiberHostConfig";
import type { WorkTag } from "./ReactWorkTags";
import type { TypeOfMode } from "./ReactTypeOfMode";
import type { Flags } from "./ReactFiberFlags";
import type { Lane, Lanes, LaneMap } from "./ReactFiberLane.old";
import type { RootTag } from "./ReactRootTags";
import type { TimeoutHandle, NoTimeout } from "./ReactFiberHostConfig";
import type { Wakeable } from "shared/ReactTypes";
import type { Cache } from "./ReactFiberCacheComponent.old";
// Unwind Circular: moved from ReactFiberHooks.old
export type HookType = "useState" | "useReducer" | "useContext" | "useRef" | "useEffect" | "useInsertionEffect" | "useLayoutEffect" | "useCallback" | "useMemo" | "useImperativeHandle" | "useDebugValue" | "useDeferredValue" | "useTransition" | "useMutableSource" | "useSyncExternalStore" | "useId" | "useCacheRefresh";
export type ContextDependency<T> = {
  context: ReactContext<T>;
  next: ContextDependency<unknown> | null;
  memoizedValue: T;
};
export type Dependencies = {
  lanes: Lanes;
  firstContext: ContextDependency<unknown> | null;
};
// Fiber 是在需要完成或已经完成的组件上的工作。 每个组件可以有多个。
// Fiber对象是用来描述虚拟DOM
export type Fiber = {
  // React元素的类型
  tag: WorkTag;
  // Unique identifier of this child.
  key: null | string;
  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any;
  // The resolved function/class/ associated with this fiber.
  type: any;
  // The local state associated with this fiber.
  // 一个组件、一个DOM节点或其他跟fiber节点相关联的React元素的实例的引用。通常，我们可以说这个属性是用于保存与一个fiber相关联的本地状态。
  stateNode: any;
  // Conceptual aliases（概念别名）
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.
  // Remaining fields belong to Fiber
  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  // 指向父节点
  return: Fiber | null;
  // Singly Linked List Tree Structure.
  // 指向子节点
  child: Fiber | null;
  // 指向兄弟节点
  sibling: Fiber | null;
  index: number;
  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref: null | (((handle: unknown) => void) & {
    _stringRef: string | null | undefined;
  }) | RefObject;
  // Input is the data coming into process this fiber. Arguments. Props.
  // 在开始执行时设置 props 值
  pendingProps: any;
  // This type will be more specific once we overload the tag.
  // 在结束时设置的 props 值
  memoizedProps: any;
  // The props used to create the output.
  // A queue of state updates and callbacks.
  updateQueue: unknown;
  // The state used to create the output
  // 当前 state
  memoizedState: any;
  // Dependencies (contexts, events) for this fiber, if it has any
  dependencies: Dependencies | null;
  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  mode: TypeOfMode;
  // Effect
  flags: Flags;
  subtreeFlags: Flags;
  deletions: Array<Fiber> | null;
  // Singly linked list fast path to the next fiber with side-effects.
  // effect 节点指针，指向下一个 effect
  nextEffect: Fiber | null;
  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  // effect list 是单向链表，第一个 effect
  firstEffect: Fiber | null;
  // effect list 是单向链表，最后一个 effect
  lastEffect: Fiber | null;
  lanes: Lanes;
  childLanes: Lanes;
  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  // 备用的Fiber节点
  alternate: Fiber | null;
  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number;
  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number;
  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number;
  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number;
  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only
  _debugSource?: Source | null;
  _debugOwner?: Fiber | null;
  _debugIsCurrentlyTiming?: boolean;
  _debugNeedsRemount?: boolean;
  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes?: Array<HookType> | null;
};
type BaseFiberRootProperties = {
  // The type of root (legacy, batched, concurrent, etc.)
  tag: RootTag;
  // Any additional information from the host associated with this root.
  containerInfo: any;
  // Used only by persistent updates.
  pendingChildren: any;
  // The currently active root fiber. This is the mutable root of the tree.
  current: Fiber;
  pingCache: WeakMap<Wakeable, Set<unknown>> | Map<Wakeable, Set<unknown>> | null;
  // A finished work-in-progress HostRoot that's ready to be committed.
  finishedWork: Fiber | null;
  // Timeout handle returned by setTimeout. Used to cancel a pending timeout, if
  // it's superseded by a new one.
  timeoutHandle: TimeoutHandle | NoTimeout;
  // Top context object, used by renderSubtreeIntoContainer
  context: Record<string, any> | null;
  pendingContext: Record<string, any> | null;
  // Determines if we should attempt to hydrate on the initial mount
  readonly isDehydrated: boolean;
  // Used by useMutableSource hook to avoid tearing during hydration.
  mutableSourceEagerHydrationData?: Array<MutableSource<any> | MutableSourceVersion> | null;
  // Node returned by Scheduler.scheduleCallback. Represents the next rendering
  // task that the root will work on.
  callbackNode: any;
  callbackPriority: Lane;
  eventTimes: LaneMap<number>;
  expirationTimes: LaneMap<number>;
  pendingLanes: Lanes;
  suspendedLanes: Lanes;
  pingedLanes: Lanes;
  expiredLanes: Lanes;
  mutableReadLanes: Lanes;
  finishedLanes: Lanes;
  entangledLanes: Lanes;
  entanglements: LaneMap<Lanes>;
  pooledCache: Cache | null;
  pooledCacheLanes: Lanes;
  // TODO: In Fizz, id generation is specific to each server config. Maybe we
  // should do this in Fiber, too? Deferring this decision for now because
  // there's no other place to store the prefix except for an internal field on
  // the public createRoot object, which the fiber tree does not currently have
  // a reference to.
  identifierPrefix: string;
};
// The following attributes are only used by DevTools and are only present in DEV builds.
// They enable DevTools Profiler UI to show which Fiber(s) scheduled a given commit.
type UpdaterTrackingOnlyFiberRootProperties = {
  memoizedUpdaters: Set<Fiber>;
  pendingUpdatersLaneMap: LaneMap<Set<Fiber>>;
};
export type SuspenseHydrationCallbacks = {
  onHydrated?: (suspenseInstance: SuspenseInstance) => void;
  onDeleted?: (suspenseInstance: SuspenseInstance) => void;
};
// The follow fields are only used by enableSuspenseCallback for hydration.
type SuspenseCallbackOnlyFiberRootProperties = {
  hydrationCallbacks: null | SuspenseHydrationCallbacks;
};
// Exported FiberRoot type includes all properties,
// To avoid requiring potentially error-prone :any casts throughout the project.
// The types are defined separately within this file to ensure they stay in sync.
export type FiberRoot = BaseFiberRootProperties & SuspenseCallbackOnlyFiberRootProperties & UpdaterTrackingOnlyFiberRootProperties;
type BasicStateAction<S> = ((arg0: S) => S) | S;
type Dispatch<A> = (arg0: A) => void;
export type Dispatcher = {
  getCacheSignal?: () => AbortSignal;
  getCacheForType?: <T>(resourceType: () => T) => T;
  readContext<T>(context: ReactContext<T>): T;
  useState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>];
  useReducer<S, I, A>(reducer: (arg0: S, arg1: A) => S, initialArg: I, init?: (arg0: I) => S): [S, Dispatch<A>];
  useContext<T>(context: ReactContext<T>): T;
  useRef<T>(initialValue: T): {
    current: T;
  };
  useEffect(create: () => (() => void) | void, deps: Array<unknown> | void | null): void;
  useInsertionEffect(create: () => (() => void) | void, deps: Array<unknown> | void | null): void;
  useLayoutEffect(create: () => (() => void) | void, deps: Array<unknown> | void | null): void;
  useCallback<T>(callback: T, deps: Array<unknown> | void | null): T;
  useMemo<T>(nextCreate: () => T, deps: Array<unknown> | void | null): T;
  useImperativeHandle<T>(ref: {
    current: T | null;
  } | ((inst: T | null) => unknown) | null | void, create: () => T, deps: Array<unknown> | void | null): void;
  useDebugValue<T>(value: T, formatterFn: ((value: T) => unknown) | null | undefined): void;
  useDeferredValue<T>(value: T): T;
  useTransition(): [boolean, (arg0: () => void) => void];
  useMutableSource<Source, Snapshot>(source: MutableSource<Source>, getSnapshot: MutableSourceGetSnapshotFn<Source, Snapshot>, subscribe: MutableSourceSubscribeFn<Source, Snapshot>): Snapshot;
  useSyncExternalStore<T>(subscribe: (arg0: () => void) => () => void, getSnapshot: () => T, getServerSnapshot?: () => T): T;
  useId(): string;
  useCacheRefresh?: () => <T>(arg0: (() => T) | null | undefined, arg1: T | null | undefined) => void;
  unstable_isNewReconciler?: boolean;
};