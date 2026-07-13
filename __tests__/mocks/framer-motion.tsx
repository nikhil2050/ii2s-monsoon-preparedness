import React from "react";

const motion = {
  div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("div", props, children),
  ul: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("ul", props, children),
  li: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("li", props, children),
  button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("button", props, children),
  form: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("form", props, children),
  p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("p", props, children),
  span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement("span", props, children),
};

const AnimatePresence = ({ children }: React.PropsWithChildren) => React.createElement(React.Fragment, null, children);

export { motion, AnimatePresence };
export default motion;
