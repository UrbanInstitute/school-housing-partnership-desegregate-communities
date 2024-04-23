<script>
  import MapInfo from "./MapInfo.svelte";
  import MapComponent from "./MapComponent.svelte";
  import ScatterContainer from "./ScatterContainer.svelte";
  import Takeaways from "./Takeaways.svelte";
  import { schoolsInTract, schoolIndexInTract, selectedSchoolID } from "../../stores/school.js";
  import { isMapContainerActive } from "../../stores/activeFrame";
  import { refreshMap, zoomLevelIsCounty } from "../../stores/map";
  import { logClickToGA } from "$utils/analytics";

  function getNextSchool() {
    //I'm doing it this way so we get index out of the box on clicking a new marker
    if ($schoolIndexInTract == $schoolsInTract.length - 1) {
      //if it's the last one
      selectedSchoolID.set($schoolsInTract[0].ncessch);
    } else {
      selectedSchoolID.set($schoolsInTract[$schoolIndexInTract + 1].ncessch); //will auto incriment index
    }
  }

  let width = 0;
</script>

<div class="container" bind:clientWidth={width}>
  <h2 class="big-title">
    Explore How Housing Shapes Student Enrollment in Charlotte, North Carolina
  </h2>

  <div id="toggle-bar">
    <div class="button-container">
      <button
        class="btn show-map {$isMapContainerActive ? '' : 'inactive-btn'}"
        on:click={(e) => {isMapContainerActive.set(true); setTimeout(()=>refreshMap(),15); logClickToGA(e.target, "tab_button_clicked--map");}}
      >
        Demographics
      </button>
      <button
        class="btn show-takeaways {$isMapContainerActive ? 'inactive-btn' : ''}"
        on:click={(e) => {isMapContainerActive.set(false); logClickToGA(e.target, "tab_button_clicked--scatter");}}
      >
        Takeaways
      </button>
    </div>
    {#if $schoolsInTract.length > 1 && $isMapContainerActive && width > 590 && !$zoomLevelIsCounty}
      <button class="view-next-school" on:click={(e) => {getNextSchool(); logClickToGA(e.target,"view_next_school--"+$schoolsInTract[0].geoid);}}>
        <p>View next school ({$schoolIndexInTract + 1}/{$schoolsInTract.length})</p>
        <img class="icon" src="./arrow-right.svg" alt="view next school arrow" />
      </button>
    {/if}
  </div>

  <div class="map-things {$isMapContainerActive ? '' : 'inactive-div'}">
    <MapInfo />
    <MapComponent />
  </div>
  <div class="takeaways {$isMapContainerActive ? 'inactive-div' : ''}">
    <Takeaways />
    <ScatterContainer />
  </div>
</div>

<style>
  .big-title {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-4xl);
    font-style: normal;
    font-weight: 700;
    line-height: 125%; /* 45px */
    margin-bottom: 34px;
  }

  .container {
    width: calc(100% - 10px);
    margin: 5px;
    padding-bottom: 15px;
    height: fit-content;
    position: relative;
  }

  #toggle-bar {
    display: flex;
    width: 49%;
    justify-content: space-between;
    align-items: bottom;
    flex-wrap: wrap;
  }
  .button-container {
    flex: 0 1 auto;
  }
  .view-next-school {
    flex: 0 1 auto;
    display: inline-flex;
    width: fit-content;
    height: 100%;
    align-items: center;
    gap: 8px;
    padding: 5px;
    cursor: pointer;
    border: none;
    background-color: #fff;
    border: 1px solid #fff;
    margin-right: 5px;
  }
  .view-next-school:hover .icon {
    background-color: #166a92;
  }
  .view-next-school p {
    font-weight: 700;
    font-size: 16px;
    margin-top: 5px;
  }

  .icon {
    width: 24px;
    height: 24px;
    padding: 6px;
    background-color: #2297cf;
    border-radius: 20px;
    align-self: baseline;
  }

  .map-things {
    width: 100%;
    display: flex;
    gap: 40px;
  }

  .takeaways {
    display: none;
    width: 100%;
    display: flex;
    gap: 40px;
  }

  .btn {
    color: #fff;
    cursor: pointer;
    width: 184px;
    border: none;
    font-weight: 700;
    font-size: 18px;
    font-family: var(--font-family-sans);
    padding: 12px 28px;
    line-height: 23px;
    display: inline-block;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    background-color: #2297cf;/*var(--color-blue-shade-dark)*/;
    position: relative;
    z-index: 99;
  }

  .btn:hover {
    color: #fff;
    background-color: #166a92;
  }

  .inactive-div {
    display: none;
  }

  .inactive-btn {
    background-color: #ececec;
    color: #696969;
    box-shadow: none;
  }

  @media screen and (max-width: 1216px) {
    #toggle-bar {
      width: 100%;
    }
  }

  @media screen and (max-width: 900px) {
    .big-title {
      font-size: var(--font-size-3xl);
    }
    .takeaways:not(.inactive-div) {
      display: block;
    }
    .takeaways {
      gap: 20px;
    }
    .map-things {
      gap: 20px;
    }
  }

  @media screen and (max-width: 768px) {
    .map-things,
    .takeaways {
      flex-direction: column;
    }
  }
  @media screen and (max-width: 600px) {
    #toggle-bar {
      display: block;
    }
    .button-container {
      width: 100%;
    }
    button {
      width: 49% !important;
    }
  }
</style>
