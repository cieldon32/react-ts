import type { Container } from "./ReactDOMHostConfig";
import type { FiberRoot } from "react-reconciler/src/ReactInternalTypes";
import type { ReactNodeList } from "shared/ReactTypes";
import { getInstanceFromNode, isContainerMarkedAsRoot, markContainerAsRoot, unmarkContainerAsRoot } from "./ReactDOMComponentTree";
import { listenToAllSupportedEvents } from "../events/DOMPluginEventSystem";
import { isValidContainerLegacy } from "./ReactDOMRoot";
import { DOCUMENT_NODE, ELEMENT_NODE, COMMENT_NODE } from "../shared/HTMLNodeType";
import { createContainer, findHostInstanceWithNoPortals, updateContainer, flushSync, getPublicRootInstance, findHostInstance, findHostInstanceWithWarning } from "react-reconciler/src/ReactFiberReconciler";
import { LegacyRoot } from "react-reconciler/src/ReactRootTags";
import getComponentNameFromType from "shared/getComponentNameFromType";
import ReactSharedInternals from "shared/ReactSharedInternals";
import { has as hasInstance } from "shared/ReactInstanceMap";
const ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
let topLevelUpdateWarnings;

if (__DEV__) {
  topLevelUpdateWarnings = (container: Container) => {
    if (container._reactRootContainer && container.nodeType !== COMMENT_NODE) {
      // 获取当前的host实例
      const hostInstance = findHostInstanceWithNoPortals(container._reactRootContainer.current);

      if (hostInstance) {
        if (hostInstance.parentNode !== container) {
          console.error('render(...): It looks like the React-rendered content of this ' + 'container was removed without using React. This is not ' + 'supported and will cause errors. Instead, call ' + 'ReactDOM.unmountComponentAtNode to empty a container.');
        }
      }
    }

    const isRootRenderedBySomeReact = !!container._reactRootContainer;
    const rootEl = getReactRootElementInContainer(container);
    const hasNonRootReactChild = !!(rootEl && getInstanceFromNode(rootEl));

    if (hasNonRootReactChild && !isRootRenderedBySomeReact) {
      // 如果当前节点没有根节点，则不应该顶用render
      console.error('render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.');
    }
    // 不鼓励将组件直接渲染到 document.body 中
    if (container.nodeType === ELEMENT_NODE && ((container as any) as Element).tagName && ((container as any) as Element).tagName.toUpperCase() === 'BODY') {
      console.error('render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.');
    }
  };
}

function getReactRootElementInContainer(container: any) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

function legacyCreateRootFromDOMContainer(container: Container, forceHydrate: boolean): FiberRoot {
  // First clear any existing content.
  if (!forceHydrate) {
    let rootSibling;

    while (rootSibling = container.lastChild) {
      container.removeChild(rootSibling);
    }
  }

  const root = createContainer(container, LegacyRoot, forceHydrate, null, // hydrationCallbacks
  false, // isStrictMode
  false, // concurrentUpdatesByDefaultOverride,
  '' // identiferPrefix
  );
  markContainerAsRoot(root.current, container);
  const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
  listenToAllSupportedEvents(rootContainerElement);
  return root;
}

function warnOnInvalidCallback(callback: unknown, callerName: string): void {
  if (__DEV__) {
    if (callback !== null && typeof callback !== 'function') {
      console.error('%s(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callerName, callback);
    }
  }
}

function legacyRenderSubtreeIntoContainer(
  parentComponent: React.Component<any, any> | null | undefined, 
  children: ReactNodeList, 
  container: Container, 
  forceHydrate: boolean, 
  callback: Function | null | undefined
) {
  if (__DEV__) {
    // 判斷根節點是否符合規則
    topLevelUpdateWarnings(container);
    // 存在回調函數的話，驗證是否是函數類型
    warnOnInvalidCallback(callback === undefined ? null : callback, 'render');
  }

  let root = container._reactRootContainer;
  let fiberRoot: FiberRoot;

  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    fiberRoot = root;

    if (typeof callback === 'function') {
      const originalCallback = callback;

      callback = function () {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }

    // Initial mount should not be batched.
    flushSync(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root;

    if (typeof callback === 'function') {
      const originalCallback = callback;

      callback = function () {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }

    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}

export function findDOMNode(componentOrElement: Element | (React.Component<any, any> | null | undefined)): null | Element | Text {
  if (__DEV__) {
    const owner = (ReactCurrentOwner.current as any);

    if (owner !== null && owner.stateNode !== null) {
      const warnedAboutRefsInRender = owner.stateNode._warnedAboutRefsInRender;

      if (!warnedAboutRefsInRender) {
        console.error('%s is accessing findDOMNode inside its render(). ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', getComponentNameFromType(owner.type) || 'A component');
      }

      owner.stateNode._warnedAboutRefsInRender = true;
    }
  }

  if (componentOrElement == null) {
    return null;
  }

  if ((componentOrElement as any).nodeType === ELEMENT_NODE) {
    return (componentOrElement as any);
  }

  if (__DEV__) {
    return findHostInstanceWithWarning(componentOrElement, 'findDOMNode');
  }

  return findHostInstance(componentOrElement);
}
export function hydrate(element: React.ReactNode, container: Container, callback: Function | null | undefined) {
  if (__DEV__) {
    console.error('ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot ' + 'instead. Until you switch to the new API, your app will behave as ' + "if it's running React 17. Learn " + 'more: https://reactjs.org/link/switch-to-createroot');
  }

  if (!isValidContainerLegacy(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  if (__DEV__) {
    const isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;

    if (isModernRoot) {
      console.error('You are calling ReactDOM.hydrate() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. ' + 'Did you mean to call hydrateRoot(container, element)?');
    }
  }

  // TODO: throw or warn if we couldn't hydrate?
  return legacyRenderSubtreeIntoContainer(null, element, container, true, callback);
}
export function render(element: React.ReactElement<React.ComponentProps<any>, any>, container: Container, callback: Function | null | undefined) {
  if (__DEV__) {
    console.error('ReactDOM.render is no longer supported in React 18. Use createRoot ' + 'instead. Until you switch to the new API, your app will behave as ' + "if it's running React 17. Learn " + 'more: https://reactjs.org/link/switch-to-createroot');
  }
  // 判斷是否是有效dom節點
  if (!isValidContainerLegacy(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  if (__DEV__) {
    // 是否已經是根節點
    const isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;

    if (isModernRoot) {
      console.error('You are calling ReactDOM.render() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. ' + 'Did you mean to call root.render(element)?');
    }
  }

  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
export function unstable_renderSubtreeIntoContainer(parentComponent: React.Component<any, any>, element: React.ReactElement<React.ComponentProps<any>, any>, containerNode: Container, callback: Function | null | undefined) {
  if (!isValidContainerLegacy(containerNode)) {
    throw new Error('Target container is not a DOM element.');
  }

  if (parentComponent == null || !hasInstance(parentComponent)) {
    throw new Error('parentComponent must be a valid React Component');
  }

  return legacyRenderSubtreeIntoContainer(parentComponent, element, containerNode, false, callback);
}
export function unmountComponentAtNode(container: Container) {
  if (!isValidContainerLegacy(container)) {
    throw new Error('unmountComponentAtNode(...): Target container is not a DOM element.');
  }

  if (__DEV__) {
    const isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;

    if (isModernRoot) {
      console.error('You are calling ReactDOM.unmountComponentAtNode() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. Did you mean to call root.unmount()?');
    }
  }

  if (container._reactRootContainer) {
    if (__DEV__) {
      const rootEl = getReactRootElementInContainer(container);
      const renderedByDifferentReact = rootEl && !getInstanceFromNode(rootEl);

      if (renderedByDifferentReact) {
        console.error("unmountComponentAtNode(): The node you're attempting to unmount " + 'was rendered by another copy of React.');
      }
    }

    // Unmount should not be batched.
    flushSync(() => {
      legacyRenderSubtreeIntoContainer(null, null, container, false, () => {
        // $FlowFixMe This should probably use `delete container._reactRootContainer`
        container._reactRootContainer = null;
        unmarkContainerAsRoot(container);
      });
    });
    // If you call unmountComponentAtNode twice in quick succession, you'll
    // get `true` twice. That's probably fine?
    return true;
  } else {
    if (__DEV__) {
      const rootEl = getReactRootElementInContainer(container);
      const hasNonRootReactChild = !!(rootEl && getInstanceFromNode(rootEl));
      // Check if the container itself is a React root node.
      const isContainerReactRoot = container.nodeType === ELEMENT_NODE && isValidContainerLegacy(container.parentNode) && !!container.parentNode._reactRootContainer;

      if (hasNonRootReactChild) {
        console.error("unmountComponentAtNode(): The node you're attempting to unmount " + 'was rendered by React and is not a top-level container. %s', isContainerReactRoot ? 'You may have accidentally passed in a React root node instead ' + 'of its container.' : 'Instead, have the parent component update its state and ' + 'rerender in order to remove this component.');
      }
    }

    return false;
  }
}