type RendererTask = (arg0: boolean) => RendererTask | null;
const ReactCurrentActQueue = {
  current: (null as null | Array<RendererTask>),
  // Used to reproduce behavior of `batchedUpdates` in legacy mode.
  isBatchingLegacy: false,
  didScheduleLegacyUpdate: false
};
export default ReactCurrentActQueue;