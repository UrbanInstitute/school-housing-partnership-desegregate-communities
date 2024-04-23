<script>
  import { slide } from "svelte/transition";

  //source: https://www.census.gov/quickfacts/fact/table/mecklenburgcountynorthcarolina/PST045223
</script>

<div class="overall" transition:slide={{ duration: 0 }}>
  <h2 class="charlotte-header">Charlotte, NC</h2>
  <div class="flex-items">
    <div class="population-box item">
      <img class="icon" src="./people.svg" alt="" />
      <div class="text">
        <p class="number">1,145,392</p>
        <p class="label">Population</p>
      </div>
    </div>
    <div class="income-box item">
      <img class="icon" src="./money.svg" alt="" />
      <div class="text">
        <p class="number">$48,625</p>
        <p class="label">Median income</p>
      </div>
    </div>
  </div>
</div>

<style>
  /**
    .overall{
        border: 1px solid #F5F5F5;
        background: #FFF;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        padding: 27px 18px;
    }
    */

  .charlotte-header {
    font-size: 36px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    margin-bottom: 27px;
  }

  .flex-items {
    display: flex;
    gap: 54px;
  }

  .item {
    display: flex;
    flex: 1 1 50%;
    gap: 6px;
  }

  .icon {
    flex: 0 1 30px;
    width: 32px;
    height: 32px;
    margin-top: 6px;
  }

  .text {
    flex: 0 1 auto;
    text-transform: uppercase;
  }

  .number {
    font-size: 30px;
    font-style: normal;
    font-weight: 300;
    line-height: 137.5%; /* 41.25px */
    margin-bottom: 0;
  }

  .label {
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 24px */
    margin-bottom: 0;
  }

  @media screen and (max-width: 450px) {
    .charlotte-header {
      font-size: 24px;
      line-height: 137.5%;
    }

    .number {
      font-size: 24px;
      line-height: 150%; /* 36px */
    }

    .label {
      font-size: 16px;
      line-height: 150%; /* 24px */
    }
    .flex-items {
      flex-direction: column;
      gap: 9px;
    }
    .item:not(:first-of-type) {
      border-top: 1px solid #ececec;
      padding-top: 10px;
    }
  }
</style>
