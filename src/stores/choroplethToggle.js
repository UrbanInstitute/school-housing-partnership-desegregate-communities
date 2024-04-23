import { writable, readable, derived } from "svelte/store";

//holds currently active variable
export const metricToggle = writable("tract_pct_nonwhite");

//holds all possible active variables
export const metricToggleOptions = readable([
  { label: "Residents of color", value: "tract_pct_nonwhite" },
  { label: "Median rent", value: "median_gross_rent" },
  { label: "Median mortgage", value: "median_owner_cost_mortgage" },
  { label: "Owner-occupied homes", value: "percent_owner_occupied" },
  { label: "Renter-occupied homes", value: "percent_renter_occupied" },
  { label: "Public housing", value: "public_housing_share" },
]);

export const metricLabel = derived([metricToggle, metricToggleOptions], ([$metricToggle, $metricToggleOptions])=>{
  return $metricToggleOptions.filter((d) => d.value == $metricToggle)[0].label
})

export let metricFormat = derived(metricToggle, ($metricToggle) => {
  let format;
  switch ($metricToggle) {
    case "median_gross_rent": format = new Intl.NumberFormat('en-US',{style: "currency", currency: "USD", maximumFractionDigits: 0}); break;
    case "median_owner_cost_mortgage": format = new Intl.NumberFormat('en-US',{style: "currency", currency: "USD", maximumFractionDigits: 0}); break;
    case "percent_owner_occupied": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    case "percent_renter_occupied": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    case "tract_pct_nonwhite": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    case "public_housing_share": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    default: format = new Intl.NumberFormat('en-US',{style: "percent"}); ;
  }
  return format;
})