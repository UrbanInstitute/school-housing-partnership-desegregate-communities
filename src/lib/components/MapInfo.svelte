<script>
  import CharlotteHousingUnitsChartBox from "./CharlotteHousingUnitsChartBox.svelte";
  import CharlotteOverallBox from "./CharlotteOverallBox.svelte";
  import CharlotteRaceEthBreakdownChartBox from "./CharlotteRaceEthBreakdownChartBox.svelte";
  import SchoolStatsBox from "./SchoolStatsBox.svelte";
  import SchoolTractRaceEthBreakdownBox from "./SchoolTractRaceEthBreakdownBox.svelte";
  import TractHousingUnitsChartBox from "./TractHousingUnitsChartBox.svelte";

  import { zoomLevelIsCounty } from "../../stores/map.js";
  import { selectedSchoolID } from "../../stores/school";
  import NoSchoolBox from "./NoSchoolBox.svelte";

  //$: theresASchool = $schoolsInTract.length != 0
  $: theresASchool = $selectedSchoolID != "999999";
</script>

<div class="map-info">
  {#if $zoomLevelIsCounty}
    <CharlotteOverallBox />
    <CharlotteRaceEthBreakdownChartBox />
    <CharlotteHousingUnitsChartBox />
  {:else}
    {#if theresASchool}
      <SchoolStatsBox />
    {:else}
      <NoSchoolBox />
    {/if}
    <SchoolTractRaceEthBreakdownBox />
    <TractHousingUnitsChartBox />
  {/if}
</div>

<style>
  .map-info {
    flex: 1 1 50%;
  }
</style>
