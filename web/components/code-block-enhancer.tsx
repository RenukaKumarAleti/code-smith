"use client";

import { useEffect } from "react";

/**
 * Augments rendered <pre> blocks with a per-block copy button.
 * Runs once after hydration on each docs page.
 */
export function CodeBlockEnhancer() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>(".prose pre");
    blocks.forEach((pre) => {
      if (pre.dataset.enhanced) return;
      pre.dataset.enhanced = "true";

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      wrapper.style.position = "relative";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "Copy";

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.innerText);
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = "Copy"), 1600);
        } catch {
          /* clipboard blocked */
        }
      });

      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(btn);
    });
  }, []);

  return null;
}
