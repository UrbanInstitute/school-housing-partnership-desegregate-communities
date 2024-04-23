<script>
  import Dropdown from "./Dropdown.svelte";
  import {
    takeawaysText,
    takeawaysTitles,
    housingIndicatorsData,
  } from "../../stores/scatterplotControl";
  import DoubleRangeSlider from "./DoubleRangeSlider.svelte";
  import PopupTooltip from "./PopupTooltip.svelte";

  let width = 100;
  let textOne, textTwo;

  $: if (textOne) textOne.innerHTML = $takeawaysText[0];
  $: if (textTwo) textTwo.innerHTML = $takeawaysText[1];

</script>

<svelte:window bind:innerWidth={width}/>
<div class="takeaway-sidebar">
  <h2 class="takeaway-header">Housing’s Influence on Education</h2>
  <p>
    To demonstrate how a school’s surrounding neighborhood can influence its enrollment, we’ve
pulled select housing and education indicators. On these scatterplots, each dot represents a school in
the Charlotte-Mecklenburg School District.
  </p>

  <div class="dropdown-collection">
    <Dropdown indicatorData={housingIndicatorsData} labelVar = {"dropTitle"} valueVar={"var"} axisLabel={"median_gross_rent"} />
  </div>

 
  {#if width>900}
  <div class="title-block">
    <div class="title-text">Public school capture</div>
    <PopupTooltip text = {"The share of local school-age students who attend public school."}/>
  </div>
  <DoubleRangeSlider />
  {/if}

  <div class="takeaway-callouts {width < 530 ? 'stack' : ''}">
    <div class="takeaway-chunk">
      <div class="takeaway-title">{$takeawaysTitles[0]}</div>
      <div class="takeaway-text" bind:this={textOne} />
    </div>

    <div class="takeaway-chunk">
      <div class="takeaway-title">{$takeawaysTitles[1]}</div>
      <div class="takeaway-text" bind:this={textTwo} />
    </div>
  </div>

  {#if width<=900}
  <div class="title-block">
    <div class="title-text">Public school capture</div>
    <PopupTooltip text = {"The share of local school-age students who attend public school."} popupID="public_school_capture"/>
  </div>
  <DoubleRangeSlider />
  {/if}
</div>

<style>
  .takeaway-sidebar {
    flex: 0 1 50%;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 50px;
    text-align: left;
  }

  .takeaway-header {
    margin-bottom: 10px;
  }

  .dropdown-collection {
    margin-top: 10px;
  }

  .title-block {
    position: relative;
    margin-top: 40px;
  }
  .title-text {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
  }

  .takeaway-callouts {
    display: flex;
    gap: 40px;
    margin-top: 40px;
  }
  .stack {
    flex-direction: column;
  }

  .takeaway-chunk {
    flex: 0 1 49%;
    font-size: 16px;
  }

  .takeaway-title {
    font-weight: bold;
    margin-bottom: 5px;
  }

  :global(a) {
    color: #1696d2;
    text-decoration: none;
  }
  :global(a):hover {
    text-decoration: underline;
  }

  @media screen and (max-width: 520px) {
    .popup {
      left: 150px;
      top: 30px;
    }
  }

  @media screen and (max-width: 768px){
    .takeaway-sidebar{
      padding: 20px;
    }
  }
</style>
