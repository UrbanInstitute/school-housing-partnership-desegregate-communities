<script>
  import DotSingleBar from "./DotSingleBar.svelte";

  //an array of objects, where each property of the object is expected to be visualized
  //that means no id values, no geoids or otherwise.
  //example:
  // [
  //    {2017: 32, 2018: 48, 2019: 56},
  //    {2017: 25, 2018: 30, 2019: 35}
  //]
  export let listOfDataSources = [];
  export let listOfLabels = [];

  $: numberOfSources = listOfDataSources.length;
  let numberOfVariables = 0;

  $: if (numberOfSources > 0 && listOfDataSources[0] != undefined) {
    numberOfVariables = Object.values(listOfDataSources[0]).length;
  }

  //this should use the actual colors library rip
  let allColorsList = ["#2297cf", "#166a92", "#f9bd30", "#59b54c", "#9D9D9D"];

  //the structure here is an array of arrays of colors.
  //for single-source charts, each variable should get its own color.
  //for multi-source charts, each SOURCE should get its own color.
  //but the expected format is the same -- access colors by index of source and variable,
  //so even the single-source list is nested.
  let colorList = [];
  $: if ((numberOfSources, numberOfVariables)) {
    colorList = [];
    if (numberOfSources == 1) {
      colorList.push([]);
      for (let i = 1; i <= numberOfVariables; i++) {
        colorList.push([]);
        colorList[i].push(allColorsList[(i - 1) % allColorsList.length]); //linearly
      }
    } else {
      for (let i = 0; i < numberOfVariables; i++) {
        colorList.push([]);
        for (let j = 0; j < numberOfSources; j++) {
          colorList[i].push(allColorsList[j % allColorsList.length]); //repeat, one color per source
        }
      }
    }
  }

  //this dictates the maximum y value in the range.
  //It is hardcoded this way so that if you have a dynamic viz
  //that occupies the same space across multiple iterations, there's a shared scale
  let expected_maximum_value = 100;

  let totalWidth = 0; //to start
  let totalHeight = 0; //to start
  let breakpoint = 500; //where to drop to three bars per row

  let bufferBetweenCircles = 2; //in pixels, twice radius plus space between
  let bufferBetweenGroups = 10; //space between one group and the next

  let bar_group_buffer = 27; //below bar above group label
  let bar_label_buffer = 25; //above bar below bar label

  let circlesPerBar = 10; //width
  let circlesPerHighestHeight = 10; //height

  //for effective flex wrap
  $: effectiveWidth =
    totalWidth < breakpoint && numberOfSources > 1 ? (totalWidth * 5) / 3 : totalWidth;
  $: effectiveHeight = 150;

  //one set is the width of a single circle with buffer for each bar needed to be displayed
  //need to display one circle per variable per source to get one set
  //how many sets can we fit in the total width ==> how many circles wide each bar can be
  $: widestWidthOfBar =
    (effectiveWidth - 10 - bufferBetweenGroups * (numberOfVariables - 2)) /
    (numberOfSources * (numberOfVariables - 1)); //minus one bc not the id variable

  // how wide and tall can we be and still fit in the space?
  $: widestPossibleRadius = (widestWidthOfBar / circlesPerBar - bufferBetweenCircles) / 2; //minus 2 bc first var is id
  $: tallestPossibleRadius =
    ((effectiveHeight - bar_label_buffer - bar_group_buffer) / circlesPerHighestHeight -
      bufferBetweenCircles) /
    2;

  $: circleRadius = Math.min(widestPossibleRadius, tallestPossibleRadius);

  $: widthOfBar = circlesPerBar * (2 * circleRadius + bufferBetweenCircles); //have to take the long way bc the display area is SQUARE

  $: if (totalWidth < breakpoint) {
    bufferBetweenCircles = 1;
  } else {
    bufferBetweenCircles = 2;
  }
</script>

{#if numberOfSources > 1}
  <div class="legend">
    <div class="square" style="background-color: {allColorsList[0]};" />
    <div class="legend-text">School share</div>
    <div class="square" style="background-color: {allColorsList[1]};" />
    <div class="legend-text">Census tract share</div>
  </div>
{/if}
<div
  class="container"
  style="gap: {bufferBetweenGroups}px; height: {totalWidth < breakpoint && numberOfSources > 1
    ? 280
    : 150}px;
    flex-wrap: {numberOfSources > 1 ? 'wrap' : 'nowrap'};"
  bind:clientWidth={totalWidth}
  bind:clientHeight={totalHeight}
>
  {#each { length: numberOfVariables } as _, i}
    {#if i != 0}
      <!--do not use first column in jsons as this is expected to be the id // totalHeight - bar_label_buffer // effectiveHeight - bar_label_buffer-->
      <div class="category-box {(totalWidth < breakpoint && numberOfSources > 1 && i == numberOfVariables - 1) ? 'push' : ''}" >
        <div class="bars-in-group">
          {#each { length: numberOfSources } as _, j (i * numberOfSources + j)}
            <DotSingleBar
              {circleRadius}
              {widthOfBar}
              heightOfBar={widthOfBar + bar_label_buffer}
              {bufferBetweenCircles}
              {circlesPerBar}
              {expected_maximum_value}
              {circlesPerHighestHeight}
              color={colorList[i][j]}
              value={Object.values(listOfDataSources[j])[i] == "NA"
                ? 0
                : Object.values(listOfDataSources[j])[i]}
            />
          {/each}
        </div>
        <div class="category-label" >{listOfLabels[i - 1]}</div>
      </div>
      {#if totalWidth < breakpoint && numberOfSources > 1 && i == 3}
        <div class="break" />
      {/if}
    {/if}
  {/each}
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    overflow: hidden;
    justify-content: space-around;
  }
  .legend {
    margin-top: 15px;
    margin-bottom: 15px;
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

  .category-box {
    flex: 0 1 auto;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }
  .bars-in-group {
    flex: 0 1 auto;
    border-bottom: 2px solid black;
  }
  .category-label {
    font-size: 14px;
    flex: 0 1 auto;
    text-align: center;
  }

  .break {
    flex-basis: 100%;
    height: 0px;
  }
  .push{
    margin-right: 34%;
  }
</style>
