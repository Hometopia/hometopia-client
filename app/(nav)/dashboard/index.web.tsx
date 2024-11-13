import React from "react";

export default function Dashboard_Web() {
  return (
    <div
      style={{ color: "var(--color-primary-400)" }}
      onClick={() =>
        console.log(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--color-primary-400")
            .trim(),
        )
      }
    >
      dashboard.web
    </div>
  );
}
