import { writable, readable, derived } from "svelte/store";

//these are on [0,1] and relate to what location of 100% the two points fall
//these can be translated to max and min for a specific variable
export const sliderMinShare = writable(0);
export const sliderMaxShare = writable(1);

export let sliderVariable = writable("market_share_total");

//holds the data associated with the active variable
/** @type{object}
   * @property {string} metric - value of metric
   * @property {string} label - label of metric
   * @property {double} max - maximum value of metric
   * @property {double} min - minimum value of metric
   */
export const sliderData = writable({
        metric: "market_share_total",
        label: "Share of students attending school in their neighborhood",
        max: 1,
        min: 0,
        range: 1,
      });

export const sliderMaxData = derived(
  [sliderMaxShare, sliderData],
  ([$sliderMaxShare, $sliderData]) => {
    return $sliderMaxShare * $sliderData.range + $sliderData.min;
  }
);

export const sliderMinData = derived(
  [sliderMinShare, sliderData],
  ([$sliderMinShare, $sliderData]) => {
    return $sliderMinShare * $sliderData.range + $sliderData.min;
  }
);
