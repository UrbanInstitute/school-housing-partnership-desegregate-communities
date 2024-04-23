<script>
    //imports 
    import { logClickToGA } from "../../lib/utils/analytics.js"
    import Typeahead from "svelte-typeahead"
    import SearchIcon from "../../assets/icon-search.svg";
    import { selectedSchoolID } from "../../stores/school.js";
    import { flyToTract } from "../../stores/map.js";
    
    //exports
    export let data;
    
    let extract = (item) => item.school_name;
    
    /*let onTypeaheadSelect = ({detail}) => {
        selectedTractName = detail.selected
        logClickToGA(e, "county_dropdown_click--"+detail.selected)
    
        gtag('event',
            'dataviz_click', //eventName
            {
                'firing_module_name':'erap-map', 
                'target_classes':"dropdown-container",
                'target_id':"",
                'target_text':"Search for your county...",
                'dropdown_select': detail.selected
            }
        )
    }*/

    let windowWidth = 0;

</script>

<svelte:window bind:innerWidth={windowWidth}/>
<div class="search-container {windowWidth < 410 ? 'wide' : ''}">
    <Typeahead data={data} {extract} 
        showDropdownOnFocus 
        hideLabel 
        label="Search for your school." 
        placeholder="Search for your school." 
        on:select={(e) => {
            selectedSchoolID.set(e.detail.original.ncessch); 
            flyToTract(e.detail.original.ncessch, e.detail.original.geoid); 
            logClickToGA(e.explicitOriginalTarget, "school_dropdown_click--"+e.detail.selected)
        }}
    />
    <div class="search" style="background-image: url({SearchIcon});"/>
</div>
    
<style>

  .search-container{
    border: 1px solid lightgray;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .search {
    width: 20px;
    height: 20px;
    margin: 0px 10px;
    flex: 0 0 auto;
    display: inline-block;
    color: darkgrey;
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: center bottom;
    background-color: white;
    vertical-align: text-bottom;
  }
  .wide>.search{
    margin: 0px 5px;
  }

  :global([data-svelte-typeahead]){

    flex: 1 0 auto;
    display: inline-block;
    z-index: 3;
  }
  :global(.wide>[data-svelte-typeahead]){
    width: calc(100% - 35px);
  }

  :global([data-svelte-typeahead] ul){
    overflow-y: scroll;
    max-height: 300px;
  }

  :global([data-svelte-typeahead] mark){
    background-color: #FDBF11;
  }

  :global([data-svelte-typeahead] li.selected){
    background-color: #D2D2D2 !important;
  }

  /* maybe this messes with accessibility but in dark mode it's white text by default */
  :global([data-svelte-typeahead] input){
    color: black; 
    border: none !important;
  }
  
</style>