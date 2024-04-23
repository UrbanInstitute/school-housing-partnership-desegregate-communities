<script>
  import { slide } from "svelte/transition";
  import DotBarChart from "./DotBarChart.svelte";
  import { selectedSchoolID, schoolsInTract } from "../../stores/school";
  import { currentTract } from "../../stores/currentTract";
  import race_school_data from "../../data/raceeth_kids_in_school.json";
  import race_tract_data from "../../data/raceeth_kids_in_tract.json";

  $: school_data = race_school_data.filter((d) => d.ncessch == parseInt($selectedSchoolID));
  $: tract_data = race_tract_data.filter((d) => d.geoid == parseInt($currentTract));

</script>

<div class="overall" transition:slide={{ duration: 0 }}>
  <div class="race-eth item">
    <img class="icon" src="race.svg" alt="" />
    <div class="text">
      <div class="label">Population Share, by Race or Ethnicity</div>
      {#if $schoolsInTract.length > 0}
      <div class="sub-label">Does the school’s racial and ethnic makeup resemble that of the surrounding neighborhood?</div>
      {/if}
    </div>
  </div>
  <DotBarChart
    listOfDataSources={$schoolsInTract.length > 0
      ? [school_data[0], tract_data[0]]
      : [tract_data[0]]}
    listOfLabels={["White", "Black", "Hispanic", "Asian", "Other groups"]}
  />
</div>

<style>
  .overall {
    margin-top: 16px;
  }

  .item {
    display: flex;
    flex: 0 1 50%;
    gap: 6px;
    align-items: top;
  }

  .icon {
    flex: 0 1 30px;
    width: 32px;
    height: 32px;
  }

  .text {
    flex: 0 1 auto;
  }

  .label {
    font-family: Lato;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 24px */
    text-transform: uppercase;
  }

  .sub-label {
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;
  }

  @media screen and (max-width: 325px) {
    .label {
      font-family: Lato;
      font-size: 16px;
      line-height: 150%; /* 24px */
    }
  }
</style>
