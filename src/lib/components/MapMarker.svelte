<script>
  import { selectedSchoolID } from "../../stores/school";
  import { zoomLevelNumber } from "../../stores/map";
  import selectedMarker from "../../assets/school-selected.svg";
  import hoverMarker from "../../assets/school-hover.svg";
  import marker from "../../assets/school.svg";
  import { logClickToGA } from "$utils/analytics";
  export let hovered = false;
  export let myID = "";

  //this shifts the scale from min 9 and max 15 to min 5 and max 30
  $: mySize = (($zoomLevelNumber - 9) / 6) * 40 + 5;

  $: currentState = $selectedSchoolID == myID ? "selected" : hovered ? "hover" : "";
  $: image = $selectedSchoolID == myID ? selectedMarker : hovered ? hoverMarker : marker;
</script>

<div
  class="marker {currentState} "
  role="presentation"
  on:focus={(e) => (hovered = true)}
  on:blur={(e) => {
    hovered = false;
  }}
  on:mouseover={(e) => (hovered = true)}
  on:mouseout={(e) => (hovered = false)}
  on:click={(e) => {$selectedSchoolID = myID; logClickToGA(e.target, "school_marker_clicked--"+myID);}}
  on:keypress={(e) => {$selectedSchoolID = myID; logClickToGA(e.target, "school_marker_clicked--"+myID);}}
  style="background-size: {mySize}px {mySize}px; height: {mySize}px; width: {mySize}px; background-image: url({image});"
/>

<style>
  .marker {
    z-index: 4;
    transition: ease-in-out 250ms;
    border-radius: 40px;
    border: 1px solid white;
    background-position: top;
    background-repeat: no-repeat;
  }

  .marker.selected {
    border: 3px solid white;
  }
</style>
