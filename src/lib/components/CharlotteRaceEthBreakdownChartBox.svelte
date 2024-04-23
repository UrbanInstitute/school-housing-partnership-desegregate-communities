<script>
  import DotBarChart from "./DotBarChart.svelte";
  import { slide } from "svelte/transition";

  let county_data = {
    geoid: "county",
    share_white_kids: 39,
    share_black_kids: 32,
    share_hispanic_kids: 17,
    share_asian_kids: 6,
    share_other_kids: 8,
  };
  let labels = ["White", "Black", "Hispanic", "Asian", "Other groups"];
</script>

<div class="overall" transition:slide={{ duration: 0 }}>
  <div class="race-eth item">
    <img class="icon" src="./race.svg" alt="" />
    <div class="text">
      <div class="label">Race/ethnicity breakdown</div>
    </div>
  </div>
  <DotBarChart listOfDataSources={[county_data]} listOfLabels={labels} />
</div>

<style>
  .overall {
    border: 1px solid #f5f5f5;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 27px 18px;
    margin-top: 12px;
  }

  .item {
    display: flex;
    flex: 1 1 50%;
    gap: 6px;
    align-items: center;
  }

  .icon {
    flex: 0 1 30px;
    width: 32px;
    height: 32px;
  }

  .text {
    flex: 0 1 auto;
    text-transform: uppercase;
  }

  .label {
    font-family: Lato;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 24px */
  }

  .dataviz {
    background-color: lightgray;
    height: 157px;
    margin-top: 24px;
  }

  @media screen and (max-width: 325px) {
    .label {
      font-family: Lato;
      font-size: 16px;
      line-height: 150%; /* 24px */
    }
  }
</style>
