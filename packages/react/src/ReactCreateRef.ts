import type { RefObject } from "shared/ReactTypes";
// an immutable object with a single mutable value
export function createRef(): RefObject {
  const refObject = {
    current: null
  };

  if (__DEV__) {
    Object.seal(refObject);
  }

  return refObject;
}