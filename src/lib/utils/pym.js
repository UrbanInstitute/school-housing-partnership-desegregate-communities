import pym from "pym.js";

export function initializePym(polling = 500) {
  if (typeof window !== "undefined") {
    return new pym.Child({ polling: polling });
  }
}

export const pymChild = initializePym();
