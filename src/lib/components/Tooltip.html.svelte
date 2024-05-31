<!--
  @component
  Generates a hover tooltip. It creates a slot with an exposed variable via `let:detail` that contains information about the event. Use the slot to populate the body of the tooltip using the exposed variable `detail`.
 -->
<script>
  /** @type {Object} evt - A svelte event created via [`dispatch`](https://svelte.dev/docs#createEventDispatcher) with event information under `evt.detail.e`. */
  export let evt = {};
  export let outerHeight;
  export let outerWidth;

  function calculateTop(y, offset){
    if (y < 100){
      return y + 220;
    } else {
      return y + offset;
    }
  }

  function calculateLeft(x, width){
    if (x + 110 > width){
      return width - 110;
    } else if (x < 110) {
      return 110;
    } else {
      return x;
    }
  }

  /** @type {Number} [offset=-35] - A y-offset from the hover point, in pixels. */
  export let yOffset = -35;
</script>

{#if evt.detail && evt.yVal != 0 && evt.xVal != 0}
  <div
    class="tooltip"
    style="
        top:{calculateTop(evt.yVal, yOffset)}px;
        left:{calculateLeft(evt.xVal, outerWidth)}px;
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
