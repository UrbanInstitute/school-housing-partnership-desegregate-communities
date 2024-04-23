<!--
  @component
  Generates an SVG scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
 <script>
  import { getContext, createEventDispatcher } from "svelte";
  import * as d3 from "d3";
  import { raise } from "layercake";
  import { sliderMaxData, sliderMinData, sliderVariable } from "../../../stores/slider";
  import { scatterplotYvar, scatterplotXvar } from "../../../stores/scatterplotControl";

  const { data, xGet, yGet, xScale, xRange, yScale, yDomain, width, height, padding } = getContext("LayerCake");

  /** @type {Number} [r=5] – The circle's radius. */
  export let r = 5;

  let basis = 0.95;

  let getColor = (val) => {
    let myColor = d3
      .scaleThreshold()
      .domain([0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100])
      .range([
        "#CFE8F3",
        "#A2D4EC",
        "#73BFE2",
        "#46ABDB",
        "#1696D2",
        "#12719E",
        "#0A4C6A",
        "#062635",
      ]);
    return myColor(val);
  };

  /** @type {String} [stroke='#000'] – The circle's stroke color. */
  export let stroke = "#0A4C6A";
  let light_stroke = "#12719E";

  /** @type {Number} [strokeWidth=0] – The circle's stroke width. */
  export let strokeWidth = 1;

  const dispatch = createEventDispatcher();

  function handleMousemove(d) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch("mousemove", { e, props: d });
      }
    };
  }
</script>

<g
  class="scatter-group"
  role="figure"
  on:mouseout={(e) => dispatch("mouseout")}
  on:blur={(e) => dispatch("mouseout")}
>
  <g class="na-line" transform="translate({$xRange[0] + $padding.left}, 30)">
    <text x="-20" y={$height + 30}>Housing data not available for these schools.</text>
    <line x1="-15" x2={$width * basis} y1={$height + 50} y2={$height + 50} stroke="#CCC" />
    <!--arrow ends-->
    <line x1="-15" x2="-10" y1={$height + 50} y2={$height + 55} stroke="#CCC" />
    <line x1="-15" x2="-10" y1={$height + 50} y2={$height + 45} stroke="#CCC" />
    <line x1={$width * basis - 5} x2={$width * basis} y1={$height + 55} y2={$height + 50} stroke="#CCC" />
    <line x1={$width * basis - 5} x2={$width * basis} y1={$height + 45} y2={$height + 50} stroke="#CCC" />
  </g>

  {#each $data as d}
    <circle
      id={"circle-" + d.ncessch}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      tabindex="-1"
      cx={$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      cy={d[$scatterplotYvar] == "NA"
        ? $height + 80
        : $yGet(d) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      {r}
      fill={d[$sliderVariable] <= $sliderMaxData && d[$sliderVariable] >= $sliderMinData
        ? getColor(d.scl_pct_nonwhite)
        : "#C9C9C9"}
      fill-opacity={d[$sliderVariable] <= $sliderMaxData && d[$sliderVariable] >= $sliderMinData
        ? 1
        : 0.5}
      stroke={d[$sliderVariable] > $sliderMaxData || d[$sliderVariable] < $sliderMinData
        ? "#CCC"
        : d[$scatterplotXvar] < 50
        ? light_stroke
        : stroke}
      stroke-width={strokeWidth}
      on:mouseover={(e) => {
        dispatch("mousemove", { e, props: d });
      }}
      on:focus={(e) => dispatch("mousemove", { e, props: d })}
      on:mousemove={handleMousemove(d)}
      on:click={(e) => dispatch("click", { e, props: d })}
      on:keypress={(e) => dispatch("click", { e, props: d })}
    />
  {/each}
</g>

<style>
  circle {
    transition: ease-in-out 250ms;
    cursor: pointer;
  }

  circle:hover,
  circle:focus {
    stroke: rgba(22, 150, 210, 0.25);
    stroke-width: 25;
  }

  :global(circle.selected) {
    stroke: rgba(22, 150, 210, 0.25);
    stroke-width: 25;
  }
</style>