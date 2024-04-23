<script>
  import { slide } from "svelte/transition";
  import GridBoxHousingUnits from "./GridBoxHousingUnits.svelte";
  import PopupTooltip from "./PopupTooltip.svelte";

  let county_data = {
    median_gross_rent: "1,369",
    median_owner_cost_mortgage: "1,689",
    percent_owner_occupied: 56,
    percent_renter_occupied: 44,
    school_aged_kids: "270,966",
  };

  let county_bar_data = {
    li_share: 2,
    ph_share: 3,
    non_ph_units: 95,
  };

  let value_one = county_bar_data.li_share;
  let value_two = county_bar_data.ph_share;
  let value_three = county_bar_data.non_ph_units;

  let width = 100;

  $: grid = width > 620 ? 250 : width > 450 ? 190 : 170;
</script>

<div class="overall" transition:slide={{ duration: 0 }} bind:clientWidth={width}>
  <div class="housing-units item">
    <img class="icon" src="./house.svg" alt="" />
    <div class="text">
      <div class="number">505,919</div>
      <div class="label">Housing units</div>
    </div>
  </div>
  <div class="lower-part {width < 620 ? 'vertical' : ''}">
    <div class="left-side">
      <div class="grid-box">
        <GridBoxHousingUnits {value_one} {value_two} heightOfGrid={grid} widthOfGrid={grid} />
      </div>
      <div class="labels">
        <div class="chunk" style="border-left: dotted #FDBF11 4px;">
          <div class="big_value">{value_one}%</div>
          <div class="value_label">
            Low-Income Housing Tax Credit units
        </div>
        </div>
        <div class="chunk" style="border-left: dotted #0A4C6A 4px;">
          <div class="big_value">{value_two}%</div>
          <div class="value_label">Public housing units</div>
        </div>
        <div class="chunk" style="border-left: dotted #1696D2 4px;">
          <div class="big_value">{value_three}%</div>
          <div class="value_label">Non–subsidized housing units</div>
        </div>
      </div>
    </div>

    <div class="right-side">
      <div class="stats-box">
        <div class="stats-item">
          <div class="stats-number">${county_data.median_gross_rent}</div>
          <div class="stats-label">Median rent</div>
        </div>
        <div class="stats-item">
          <div class="stats-number">${county_data.median_owner_cost_mortgage}</div>
          <div class="stats-label">Median mortgage</div>
        </div>
        <div class="stats-item">
          <div class="stats-number">{county_data.percent_owner_occupied}%</div>
          <div class="stats-label">Owner-occupied homes</div>
        </div>
        <div class="stats-item">
          <div class="stats-number">{county_data.percent_renter_occupied}%</div>
          <div class="stats-label">Renter-occupied homes</div>
        </div>
        <div class="stats-item">
          <div class="stats-number">{county_data.school_aged_kids}</div>
          <div class="stats-label">School-age residents</div>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom-right-icon">
    <PopupTooltip text ="The Low-Income Housing Tax Credit (LITHC) encourages the development of
            housing units affordable to people earning up to 60 percent of the area median income."
            placementBelow={false} popupID="charlotte_housing_units"/>
  </div>
</div>

<style>
  .overall {
    /* border: 1px solid #F5F5F5; */
    /* background: #FFF; */
    /* box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);  */
    /* padding: 27px 18px; */
    margin-top: 12px;
    flex: 0 1 50%;
    padding-bottom: 50px;
  }

  .item {
    display: flex;
    flex: 0 1 50%;
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
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 24px */
    padding-bottom: 3px;
  }

  .number {
    font-size: 30px;
    font-style: normal;
    font-weight: 300;
    line-height: 137.5%; /* 41.25px */
  }

  .right-side {
    flex: 0 1 35%;
  }
  .left-side {
    display: flex;
    gap: 20px;
    flex: 0 1 65%;
  }

  .grid-box {
    height: 100%;
  }

  .lower-part {
    margin-top: 10px;
    display: flex;
    gap: 20px;
  }

  .vertical {
    flex-direction: column;
    gap: 10px;
  }

  .labels {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .vertical > .left-side > .labels {
    gap: 6px;
  }
  .chunk {
    padding-left: 5px;
    flex: 0 1 auto;
  }
  .big_value {
    font-size: 24px;
    font-weight: 300;
  }
  .value_label {
    font-weight: 700;
  }

  .stats-box {
    display: flex;
    gap: 15px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .vertical > .right-side > .stats-box {
    flex-wrap: nowrap;
  }

  .stats-item {
    flex: 0 1 45%;
  }

  .stats-number {
    font-size: 18px;
    font-weight: 700;
  }

  .stats-label {
    font-size: 14px;
    line-height: 125.5%;
  }

  .bottom-right-icon {
    position: absolute;
    bottom: 17px;
    right: 17px;
  }

  @media screen and (max-width: 425px) {
    .number {
      font-size: 24px;
      line-height: 150%; /* 36px */
    }

    .label {
      font-size: 16px;
      line-height: 150%; /* 24px */
    }

    .stats-box {
      flex-direction: column;
      gap: 0;
    }
    .stats-item {
      padding: 10px 0;
      display: flex;
      align-items: center;
    }

    .stats-item:not(:first-of-type) {
      border-top: 1px solid #ececec;
    }
    .stats-label {
      display: inline;
      font-size: 14px;
      font-weight: 700;
      padding-left: 8px;
      padding-top: 5px;
    }
    .stats-number {
      display: inline;
      font-size: 30px;
      font-weight: 300;
    }
  }

  @media screen and (max-width: 625px) {
    .stats-item {
      flex: 0 1 auto;
      align-items: center;
    }

    .vertical > .right-side > .stats-box {
      flex-wrap: nowrap;
    }
  }
</style>
