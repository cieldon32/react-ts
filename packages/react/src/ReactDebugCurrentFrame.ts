const ReactDebugCurrentFrame = {};
let currentExtraStackFrame = (null as null | string);
export function setExtraStackFrame(stack: null | string) {
  if (__DEV__) {
    currentExtraStackFrame = stack;
  }
}

if (__DEV__) {
  ReactDebugCurrentFrame.setExtraStackFrame = function (stack: null | string) {
    if (__DEV__) {
      currentExtraStackFrame = stack;
    }
  };

  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = (null as null | (() => string));

  ReactDebugCurrentFrame.getStackAddendum = function (): string {
    let stack = '';

    // Add an extra top frame while an element is being validated
    if (currentExtraStackFrame) {
      stack += currentExtraStackFrame;
    }

    // Delegate to the injected renderer-specific implementation
    const impl = ReactDebugCurrentFrame.getCurrentStack;

    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

export default ReactDebugCurrentFrame;