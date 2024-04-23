<script>
  import { slide } from "svelte/transition";
  import {
    selectedSchoolData,
    schoolsInTract,
    schoolIndexInTract,
    selectedSchoolID,
  } from "../../stores/school";
  import { currentTract, selectedTractData } from "../../stores/currentTract";
  import PopupTooltip from "./PopupTooltip.svelte";

  let width = 0;

  function getNextSchool() {
    //I'm doing it this way so we get index out of the box on clicking a new marker
    if ($schoolIndexInTract == $schoolsInTract.length - 1) {
      //if it's the last one
      selectedSchoolID.set($schoolsInTract[0].ncessch);
    } else {
      selectedSchoolID.set($schoolsInTract[$schoolIndexInTract + 1].ncessch); //will auto incriment index
    }
  }
</script>

<div
  class="overall {width > 590 ? 'shadowed' : ''}"
  transition:slide={{ duration: 0 }}
  bind:clientWidth={width}
>
  <div class="top-half">
    <div class="to-the-left">
      <div class="identity">{$selectedSchoolData.school_name}</div>
      <div class="tract">
        Census tract <span class="underlined">{$currentTract.toString().substring(5)}</span>
      </div>
    </div>
    <div class="to-the-right item">
      <img class="icon" src="./people.svg" alt="" />
      <div class="text">
        <div class="label">Total students</div>
        <div class="number">{Intl.NumberFormat('en-US').format($selectedSchoolData.enrollment)}</div>
      </div>
    </div>
  </div>
  <div class="bottom-half">
    <div class="big-stat">
      <div class="giant-number">
        {Math.round(parseFloat($selectedSchoolData.student_teacher_ratio))}:1
      </div>
      <div class="giant-number-label">Student-teacher ratio</div>
    </div>
    <div class="big-stat">
      <div class="giant-number">
        {Math.round(parseFloat($selectedSchoolData.meps_poverty_pct))}%
      </div>
      <div class="giant-number-label">
        Poverty estimate
      </div>
    </div>
    <div class="big-stat">
      <div class="giant-number">{$selectedTractData.market_share}%</div>
      <div class="giant-number-label">
        Public school attendance share
      </div>
    </div>
  </div>
  <div class="bottom-right-icon">
    <PopupTooltip text = "<strong>Poverty estimate</strong>: The school-level
      share of students from households earning no more than the
     federal poverty level between fall 2013 and fall 2018.<br><strong>Public school attendance share</strong>: The census tract’s share of 
          local school-age students who attend public school." placementBelow={false} popupID="school_stats_box"/>
  </div>
  
</div>
{#if $schoolsInTract.length > 1}
  <button
    class="view-next-school shadowed"
    on:click={(e) => getNextSchool()}
    on:keypress={(e) => getNextSchool()}
  >
    <p>View next school ({$schoolIndexInTract + 1}/{$schoolsInTract.length})</p>
    <img class="arrow-icon" src="./arrow-right-blue.svg" alt="" />
  </button>
{/if}

<style>
  /**
    .overall{
        border: 1px solid #F5F5F5;
        background: #FFF;
        padding: 10px 18px;
    }
    */

  .shadowed {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .top-half,
  .bottom-half {
    display: flex;
  }

  .to-the-left {
    flex: 5 1 auto;
  }

  .to-the-right{
    flex: 1 0 auto;
    justify-content: end;
    margin-top: 10px;
    align-items: flex-start;
  }
  .big-stat {
    flex: 0 1 auto;
  }

  .top-half {
    justify-content: space-between;
    align-items:flex-start;
    padding-bottom: 30px;
    gap: 15px;
  }

  .identity {
    font-size: 30px;
    font-weight: 700;
  }

  .tract {
    font-size: 16px;
    font-weight: 400;
    padding: 3px;
  }

  .underlined {
    border-bottom: 2px solid #f9bd30;
  }

  .item {
    display: flex;
    /*flex: 0 1 50%;*/
    gap: 6px;
  }

  .icon {
    flex: 0 30px auto;
    width: 32px;
    height: 32px;
  }

  .text {
    flex: 0 1 auto;
    text-transform: uppercase;
    text-align: end;
    display: flex;
    flex-direction: column;
    align-items: end;
  }

  .label {
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 24px */
    width: fit-content;
  }

  .number {
    font-size: 30px;
    font-style: normal;
    font-weight: 300;
    line-height: 137.5%; /* 41.25px */
    width: fit-content;
  }

  .bottom-half {
    padding-bottom: 18px;
  }

  .big-stat {
    padding: 0px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .big-stat:first-child {
    padding-left: 0;
  }

  .giant-number {
    font-size: 38px;
    font-weight: 300;
    flex: 0 1 auto;
  }

  .giant-number-label {
    flex: 0 1 auto;
    font-size: 14px;
    font-weight: 700;
    line-height: 125.5%;
  }

  .big-stat:not(:first-of-type) {
    border-left: 1px solid #d2d2d2;
  }

  .bottom-right-icon {
    position: absolute;
    bottom: 17px;
    right: 17px;
  }

  .view-next-school {
    display: none;
    width: 100%;
    height: 44px;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
    border: none;
    background-color: #12719e;
    padding: 5px 15px;
  }
  .view-next-school:hover .arrow-icon {
    background-color: #0a4c6a;
  }
  .view-next-school p {
    flex: 0 1 auto;
    font-weight: 700;
    font-size: 18px;
    margin-top: 6px;
    color: white;
  }

  .arrow-icon {
    flex: 0 1 auto;
    width: 24px;
    height: 24px;
    padding: 6px;
    background-color: #fff;
    border-radius: 20px;
    align-self: baseline;
  }

  @media screen and (max-width: 550px) {
    .big-stat {
      flex-direction: column;
    }
    .giant-number-label {
      text-align: center;
    }
  }

  @media screen and (max-width: 1150px) and (min-width: 768px) {
    .big-stat {
      flex-direction: column;
    }
    .giant-number-label {
      text-align: center;
    }
  }
  @media screen and (max-width: 600px) {
    .view-next-school {
      display: inline-flex;
    }
  }

  @media screen and (max-width: 460px) {
    .identity {
      font-size: 24px;
    }
    .top-half,
    .bottom-half {
      flex-direction: column;
    }
    .big-stat {
      flex-direction: row;
      padding-left: 0;
    }
    .big-stat:not(:first-of-type) {
      border-left: none;
      border-top: 1px solid #d2d2d2;
    }
    .text {
      text-align: left;
      align-items: flex-start;
    }
    .top-half {
      align-items: flex-start;
      gap: 22px;
    }
  }
</style>
