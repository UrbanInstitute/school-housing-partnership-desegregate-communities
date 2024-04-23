<script>
  import { onMount } from "svelte";
  import "../../../node_modules/mapbox-gl/dist/mapbox-gl.css";
  import { logClickToGA } from "$utils/analytics";

  import { metricToggle, metricToggleOptions } from "../../stores/choroplethToggle";
  import ToggleGroup from "./Toggle/ToggleGroup.svelte";
  import ReturnToTop from "./ReturnToTop.svelte";
  import Searchbar from "./Searchbar.svelte";

  // stores
  import { newMapStore, mapStore, zoomLevelIsCounty } from "../../stores/map";
  import {
    selectedSchoolData,
    schoolsInTract,
    schoolIndexInTract,
    selectedSchoolID,
    school_identifiers,
  } from "../../stores/school";
  import { currentTract } from "../../stores/currentTract";
  import MapLegend from "./MapLegend.svelte";



  // declare map element
  let mapEl;
  let width;

  // on mount, initialize and load map
  onMount(() => {
    $mapStore = newMapStore(mapEl);
    $mapStore.onLoad();
  });

  $: if ($metricToggle) {
    if ($mapStore != null && $metricToggleOptions != null) {
      $mapStore.changeActiveLayer($metricToggle, $metricToggleOptions);
      // $mapStore.isMapLoaded() --> set this to a store (better than checking map styles)
    }
  }

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

<div class="im-the-map-box" bind:clientWidth={width} >
  <div class="search {width < 420 ? 'wide' : ''}">
    <Searchbar data={school_identifiers}/>
  </div>
  <div id="mapbox-map" bind:this={mapEl} />
  <div class="legend-box">
    <MapLegend/>
  </div>
  
  {#if $schoolsInTract.length > 0 && !$zoomLevelIsCounty}
    <div class="school-title">
      <div class="school-name">{$selectedSchoolData.school_name}</div>
      <div class="school-tract">
        Census tract: <span class="underlined">{$currentTract.toString().substring(5)}</span>
      </div>
    </div>
  {/if}
  <div class="toggles on-top {/*width > 770 ? '' : 'on-top'*/ ''}">
    <h6 class="toggles-title">Charlotte's Neighborhood Characteristics</h6>
    <ToggleGroup
      options={$metricToggleOptions}
      bind:value={$metricToggle}
    />
  </div>
  {#if $schoolsInTract.length > 1 && !$zoomLevelIsCounty}
    <button
      class="view-next-school"
      on:click={(e) => {getNextSchool(); logClickToGA(e.target,"view_next_school--"+$schoolsInTract[0].geoid);}}
    >
      <p>View next school ({$schoolIndexInTract + 1}/{$schoolsInTract.length})</p>
      <img class="arrow-icon" src="./arrow-right-blue.svg" alt="view next school arrow" />
    </button>
  {/if}
  <div class="return"><ReturnToTop elementId="toggle-bar" /></div>
</div>

<style>
  .im-the-map-box {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  #mapbox-map {
    height: 800px !important;
    width: 100%;
    flex: 0 1 100%;
  }
  :global(.mapboxgl-canvas-container){
    height: 800px !important;
    width: 100% !important;
  }
  .search{
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: white;
    z-index: 2;
    max-width: 380px;
    width: calc(100% - 50px);
  }
  .wide{
    position: static;
    width: 100%;
    max-width: 100%;
  }
  .school-title {
    display: none;
    flex: 0 1 auto;
    padding-left: 17px;
    height: 56px;
    margin-top: 9px;
    padding-bottom: 15px;
    border-bottom: 1px solid #c9c9c9;
  }
  .school-name {
    font-size: 20px;
    font-weight: 700;
  }
  .school-tract {
    font-size: 16px;
  }
  .underlined {
    border-bottom: 2px solid #f9bd30;
  }
  .legend-box{
    height: 0px;
    width: 90%;
  }

  .toggles {
    flex: 0 1 auto;
    position: absolute;
    bottom: 0px;
    width: calc(100% - 36px);
    background-color: rgb(255, 255, 255, 0.85);
    /* padding: 16px 25px 25px 25px; */
    padding: 27px 18px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .toggles-title {
    margin-bottom: 0.5em;
  }

  .on-top {
    position: static;
    flex: none;
  }

  .view-next-school {
    flex: 0 1 auto;
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
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
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

  .return {
    display: none;
  }

  @media screen and (max-width: 450px) {
    #mapbox-map {
      min-height: 350px;
      max-height: 525px;
    }
  }
  @media screen and (max-width: 768px) {
    .return {
      display: block;
    }
    .view-next-school {
      display: inline-flex;
    }
    .school-title {
      display: block;
    }
  }
</style>
