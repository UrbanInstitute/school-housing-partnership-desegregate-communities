<script>
  import { logClickToGA } from "$utils/analytics";
  import ToggleButton from "./ToggleButton.svelte";
  import { createEventDispatcher } from "svelte";
  /**
   * Group of options to select between
   * @type {Array<{ label: string, value: string }>}
   **/
  export let options = [];

  /**
   * Value of the active option
   * @type {string | null}
   **/
  export let value = null;

  export let disabled = false;

  const dispatch = createEventDispatcher();

  let width = 100;
</script>

<div class="toggle-group-wrapper {width < 400 ? 'long' : ''}" bind:clientWidth={width}>
  {#each options as option}
    <div class={width > 630 ? "three-wide" : width > 465 ? "two-wide" : "tall"}>
      <ToggleButton
        label={option.label}
        value={option.value}
        {disabled}
        on:click={(e) => {
          value = option.value;
          logClickToGA(e.target, "map_toggle_change--"+value)
          dispatch("change", { target: e.target });
        }}
        is_active={value === option.value}
      />
    </div>
  {/each}
</div>

<style>
  .toggle-group-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .three-wide {
    flex: 0 1 29%;
  }
  .two-wide {
    flex: 0 1 45%;
  }
  .tall {
    flex: 0 1 100%;
  }
</style>
