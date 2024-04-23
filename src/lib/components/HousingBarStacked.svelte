<script>
  import { flip } from "svelte/animate";

  export let data;
  export let scaleTop = 100;
  export let keyCol = "geoid";
  let width = 0;

  $: dataset = Object.entries(data[0]);

  let startingValues = [0];
  let mostRecentValue = 0;
  $: if (dataset) {
    startingValues = [0];
    mostRecentValue = 0;
    for (let [i, x] of dataset) {
      if (i != keyCol) {
        startingValues.push((width / scaleTop) * x + mostRecentValue);
        mostRecentValue = (width / scaleTop) * x + mostRecentValue;
      } else {
        startingValues.push(mostRecentValue);
      }
    }
  }
  let colors = ["#0A4C6A", "#1696D2", "#73BFE2"];
</script>

<div class="chart-container" bind:clientWidth={width}>
  <div class="legend">
    <div class="square" style="background-color: {colors[0]};" />
    <div class="legend-text">LIHTC units</div>
    <div class="square" style="background-color: {colors[1]};" />
    <div class="legend-text">Non-public-housing units</div>
  </div>
  <svg class="wide">
    {#each dataset as [keys, value], i}
      {#if keys != keyCol}
        <rect
          class="chunk"
          x={startingValues[i]}
          width={(width / scaleTop) * value}
          y="30"
          height="50"
          fill={colors[i]}
        />
        {#if value != 0}
          <text x={startingValues[i] + 6} y="25">{value}%</text>
        {/if}
      {/if}
    {/each}
  </svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 100px;
  }
  .wide {
    width: 100%;
  }
  .legend {
    margin-top: 15px;
  }
  .square {
    display: inline-block;
    height: 15px;
    width: 15px;
    margin-right: 5px;
  }
  .legend-text {
    display: inline-block;
    margin-right: 20px;
  }
</style>
