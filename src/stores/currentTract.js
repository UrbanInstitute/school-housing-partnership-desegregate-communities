import { writable, derived } from "svelte/store";

export const currentTract = writable("999999999");
export const hoveredTract = writable("999999999");

import tractData from "../data/tract_indicators.json";

export let selectedTractData = derived(currentTract, ($currentTract) => {
  return tractData.filter((d) => d.geoid === parseInt($currentTract))[0];
});
