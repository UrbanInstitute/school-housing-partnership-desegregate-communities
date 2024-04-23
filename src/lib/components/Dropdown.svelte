<script>
  import Select from "svelte-select";
  import { logClickToGA } from "../utils/analytics";
  import { scatterplotYvar } from "../../stores/scatterplotControl";

  export let indicatorData;
  export let labelVar;
  export let valueVar;

  let dropdownData;

  //dropdownData is just main data manipulated into shape for dropdown
  $: dropdownData = indicatorData?.map((d) => {
    return {
      label: d[labelVar],
      value: d[valueVar],
    };
  });

  //assign the first label to axisLabel (which is the english word)
  export let axisLabel = "median_gross_rent";

  const chevronPath =
    "M15.1313 0.666626C15.5179 0.666626 15.7794 0.846014 15.9272 1.20479C16.0749 1.56356 15.9954 1.85507 15.7111 2.09052L8.65117 9.12027C8.45791 9.26602 8.2419 9.33329 8.00316 9.33329C7.76442 9.33329 7.57115 9.26602 7.42335 9.12027L0.283802 2.09052C-0.000415318 1.85507 -0.0686276 1.55235 0.0677969 1.20479C0.21559 0.846014 0.477071 0.666626 0.863607 0.666626H15.1313Z";
</script>

<div class="select-dropdown">
  <Select
    items={dropdownData}
    placeholder={"Median rent"}
    showChevron={true}
    bind:justValue={$scatterplotYvar}
    value={axisLabel}
    clearable={false}
    on:select={(e) => {
      logClickToGA(
        e.detail.target,
        `takeaways_housing_metric_select--${e.detail.label}`
      );
    }}
  >
    <!-- chevron, note: importing the SVG as a component per the docs resulted in an error -->
    <div slot="chevron-icon">
      <svg
        width="30"
        height="24"
        viewBox="0 0 20 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="padding-top:15px;"><path d={chevronPath} fill="var(--color-black)" /></svg
      >
    </div>
  </Select>
</div>

<style>
  @media screen and (max-width: 500px) {
    .title-container {
      /*padding: 2rem 0;*/
    }
  }

  :global(.select-dropdown) {
    border: 0 !important;
    padding-bottom: 5px;
    border-bottom: 2px solid black !important;
  }

  /* cursor for input */
  :global(.select-dropdown input) {
    cursor: pointer !important;
    /*text-transform: uppercase !important;*/
    font-family: var(--font-family-sans) !important;
  }

  :global(.select-dropdown .indicators) {
    cursor: pointer !important;
  }

  /* select list position */
  :global(.select-dropdown .svelte-select-list) {
    top: 2.75rem !important;
  }

  /* scrollbar */

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar) {
    width: 0.625rem;
  }

  :global(.svelte-select) {
    min-width: 250px;
  }

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar-track) {
    background: var(--color-gray-shade-lightest);
  }

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar-thumb) {
    background: var(--color-gray-shade-dark);
    border: 1px solid var(--color-gray-shade-dark);
  }

  :global(.select-dropdown .svelte-select-list) {
    font-size: 18px !important;
  }

  :global(.select-dropdown .selected-item) {
    font-size: 20px !important;
    font-weight: 700;
    border-bottom: 3px #f9bd30 solid;
    /*text-transform: uppercase !important;*/
  }

  :global(.select-dropdown .svelte-select-list) {
    font-size: 1rem !important;
    font-weight: 400;
    line-height: 150%;
  }

  /* END SCROLLBAR */

  /* css vars */
  .select-dropdown {
    border: 1px solid var(--color-gray);
    min-width: var(--min-width);
    /* display: flex;
      justify-content: right; */

    /* overall */
    --width: 100%;
    --height: 2.75rem;
    --max-height: 2.75rem;
    --min-width: 200px;
    --margin: 0;
    --padding: 0 0 0 0;
    --selected-item-padding: 0 0.25rem;
    --value-container-padding: 0;
    --placeholder-color: var(--color-black);

    /* font */
    --font-size: 16px !important;
    --font-family: var(--font-family-sans) !important;

    /* border */
    --border: 0;
    --border-radius: 0;
    --border-radius-focused: 0;
    --border-hover: 0;
    --border-focused: 0;

    /* list */
    --list-border-radius: 0;
    --item-first-border-radius: 0;
    --input-padding: 0;
    --internal-padding: 0;
    --item-padding: 0 var(--spacing-2) 0 var(--spacing-2);

    /* items */
    --item-color: var(--color-gray-shade-darker);
    --item-is-active-bg: var(--color-blue-shade-lighter);
    --item-is-active-color: var(--color-black);
    --item-hover-bg: var(--color-gray-shade-lightest);
    --selected-item-color: var(--color-black);

    /* chevron */
    --chevron-color: var(--color-black);
    --chevron-icon-colour: var(--color-black);
    --icons-color: var(--color-black);
  }
</style>
