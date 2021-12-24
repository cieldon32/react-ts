import { $NonMaybeType } from "utility-types";
import type { MutableSource, MutableSourceGetVersionFn } from "shared/ReactTypes";
export function createMutableSource<Source extends $NonMaybeType<unknown>>(source: Source, getVersion: MutableSourceGetVersionFn): MutableSource<Source> {
  const mutableSource: MutableSource<Source> = {
    _getVersion: getVersion,
    _source: source,
    _workInProgressVersionPrimary: null,
    _workInProgressVersionSecondary: null
  };

  if (__DEV__) {
    mutableSource._currentPrimaryRenderer = null;
    mutableSource._currentSecondaryRenderer = null;
    // Used to detect side effects that update a mutable source during render.
    // See https://github.com/facebook/react/issues/19948
    mutableSource._currentlyRenderingFiber = null;
    mutableSource._initialVersionAsOfFirstRender = null;
  }

  return mutableSource;
}