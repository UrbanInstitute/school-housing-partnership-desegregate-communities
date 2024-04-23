<script>

  //this is value that height is trying to replicate
  export let value = 0;
  //this is the fill color of each circle
  export let color = "#2297cf";
  //width allocated for this bar
  export let widthOfBar = 0;
  export let heightOfBar = 0;
  //this relates to how many circles wide this bar is
  export let circlesPerBar = 0;
  //how many pixels of radius does a circle have
  export let circleRadius = 5;
  //distance between two centers, including buffer
  export let bufferBetweenCircles = 2;
  //what 100% height translates to for values
  //export let expected_maximum_value = 0;
  //number of circles tall translates to expected_maximum_value
  export let circlesPerHighestHeight = 0;
  //this is mathy -- so if the bar is 3.8 circles tall, that means 3 full lines of circles
  //plus 80% of the next line
  //$: circlesTallAmI = (value / expected_maximum_value) * circlesPerHighestHeight;
</script>

<svg
  class="single-bar"
  width={widthOfBar}
  height={heightOfBar}
  role="figure"
  aria-label="A waffle chart"
>
  {#each { length: circlesPerHighestHeight } as _, h}
    {#each { length: circlesPerBar } as _, w}
      {@const index = h * circlesPerBar + w}
      <circle
        r={circleRadius}
        cx={w * (bufferBetweenCircles + 2 * circleRadius) + circleRadius}
        cy={heightOfBar - h * (bufferBetweenCircles + 2 * circleRadius) - circleRadius}
        fill={color}
        opacity={index < value ? 1 : 0.15}
      />
    {/each}
  {/each}
  <text
    class="bar-label"
    x={widthOfBar / 2 - 15}
    y={heightOfBar - 10 - circlesPerHighestHeight * (2 * circleRadius + bufferBetweenCircles)}
    >{value}%</text
  >
</svg>

<style>
  .single-bar {
    display: inline-block;
  }

  .bar-label {
    font-size: 14px;
  }

  circle {
    transition: ease-in-out 500ms;
  }

  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
