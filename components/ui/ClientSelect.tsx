"use client";

import React from "react";
import Select, { Props } from "react-select";

/**
 * Typed wrapper around react-select
 * Works with Next.js App Router + TS strict mode
 */
const ClientSelect = Select as unknown as <
  Option,
  IsMulti extends boolean = false
>(
  props: Props<Option, IsMulti>
) => React.ReactElement;

export default ClientSelect;
