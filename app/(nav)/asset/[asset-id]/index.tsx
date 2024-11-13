import { Href, Redirect, usePathname } from "expo-router";
import React from "react";

export default function AssetDetails() {
  const pathname = usePathname();
  return <Redirect href={`${pathname}/general` as Href} />;
}
