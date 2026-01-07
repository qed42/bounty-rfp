"use client";

import dynamic from "next/dynamic";
import type { Props } from "react-select";

// dynamic import → SSR disabled
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

export default Select as unknown as <Option, IsMulti extends boolean>(
  props: Props<Option, IsMulti>
) => JSX.Element;
