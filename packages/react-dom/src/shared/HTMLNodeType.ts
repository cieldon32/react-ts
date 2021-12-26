/**
 * HTML nodeType values that represent the type of the node
 * nodeType 属性可用来区分不同类型的节点，比如 元素, 文本 和 注释
 */
export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;
export const COMMENT_NODE = 8;
export const DOCUMENT_NODE = 9;
export const DOCUMENT_FRAGMENT_NODE = 11;
export enum NodeTYpe {
  ELEMENT_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE
}