// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
let disabledDepth = 0;
let prevLog;
let prevInfo;
let prevWarn;
let prevError;
let prevGroup;
let prevGroupCollapsed;
let prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
export function disableLogs(): void {
  // @ts-expect-error only called in DEV, so void return is not possible.
  if (__DEV__) {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd;
      // https://github.com/facebook/react/issues/19099
      const props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      };
      // $FlowFixMe Flow thinks console is immutable.
      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
export function reenableLogs(): void {
  // @ts-expect-error only called in DEV, so void return is not possible.
  if (__DEV__) {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      const props = {
        configurable: true,
        enumerable: true,
        writable: true
      };
      // $FlowFixMe Flow thinks console is immutable.
      Object.defineProperties(console, {
        log: { ...props,
          value: prevLog
        },
        info: { ...props,
          value: prevInfo
        },
        warn: { ...props,
          value: prevWarn
        },
        error: { ...props,
          value: prevError
        },
        group: { ...props,
          value: prevGroup
        },
        groupCollapsed: { ...props,
          value: prevGroupCollapsed
        },
        groupEnd: { ...props,
          value: prevGroupEnd
        }
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      console.error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}