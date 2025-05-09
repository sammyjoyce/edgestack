import React from "react";

export type InputProps = React.ComponentPropsWithoutRef<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function InputComponent(props, ref) {
    return <input ref={ref} {...props} />;
  }
);
