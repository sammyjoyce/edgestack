import type React from "react";
export function Fieldset(props: React.ComponentProps<"fieldset">) {
	return <fieldset {...props}>{props.children}</fieldset>;
}
export function Legend(props: React.ComponentProps<"legend">) {
	return <legend {...props}>{props.children}</legend>;
}
