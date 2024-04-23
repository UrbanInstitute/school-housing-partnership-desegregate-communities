<script>

  //this is value that height is trying to replicate
  export let value_one = 0;
  export let value_two = 0;
  //this is the fill color of each circle
  export let color = ["#f9bd30", "#166a92"];
  //this relates to how many circles wide this bar is
  export let circlesPerBar = 10;
  //distance between two centers, including buffer
  export let bufferBetweenCircles = 4;
  //what 100% height translates to for values
  export let expected_maximum_value = 100;
  //number of circles tall translates to expected_maximum_value
  export let circlesPerHighestHeight = 10;

  //export let ph_missing_flag = false;

  export let base_color = "#2297cf";

  //width allocated for this bar
  export let widthOfGrid = 200;
  export let heightOfGrid = 200;
  //this is mathy -- so if the bar is 3.8 circles tall, that means 3 full lines of circles
  //plus 80% of the next line
  //$: circlesTallAmI = ((value_one + value_two) / expected_maximum_value) * circlesPerHighestHeight;
  $: circleRadius = Math.min(
    (heightOfGrid / circlesPerHighestHeight - bufferBetweenCircles) / 2,
    (widthOfGrid / circlesPerBar - bufferBetweenCircles) / 2
  );

  function whichColor(i, val_one, val_two) {
    if (i < value_one) {
      return color[0];
    }
    if (i < val_one + val_two) {
      return color[1];
    }
    return base_color;
  }
</script>

<svg class="single-bar" width={widthOfGrid} height={heightOfGrid}>
  {#each { length: circlesPerHighestHeight } as _, h}
    {#each { length: circlesPerBar } as _, w}
      {@const index = expected_maximum_value - (h + 1) * circlesPerBar + w}
      <circle
        r={circleRadius}
        cx={w * (bufferBetweenCircles + 2 * circleRadius) + circleRadius}
        cy={heightOfGrid - h * (bufferBetweenCircles + 2 * circleRadius) - circleRadius}
        fill={whichColor(index, value_one, value_two)}
      />
    {/each}
  {/each}
</svg>

<style>
  circle {
    transition: ease-in-out 500ms;
  }
</style>
