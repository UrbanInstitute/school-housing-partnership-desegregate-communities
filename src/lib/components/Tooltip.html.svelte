<!--
  @component
  Generates a hover tooltip. It creates a slot with an exposed variable via `let:detail` that contains information about the event. Use the slot to populate the body of the tooltip using the exposed variable `detail`.
 -->
<script>
  /** @type {Object} evt - A svelte event created via [`dispatch`](https://svelte.dev/docs#createEventDispatcher) with event information under `evt.detail.e`. */
  export let evt = {};

  /** @type {Number} [offset=-35] - A y-offset from the hover point, in pixels. */
  export let offset = -35;
</script>

{#if evt.detail && evt.yVal != 0 && evt.xVal != 0}
  <div
    class="tooltip"
    style="
        top:{evt.yVal + offset}px;
        left:{evt.xVal}px;
      "
  >
    <slot detail={evt.detail} />
  </div>
{/if}

<style>
  .tooltip {
    position: absolute;
    min-width: 220px;
    border: 1px solid #ccc;
    font-size: 13px;
    background: rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -100%);
    padding: 22px;
    z-index: 15;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }
</style>
