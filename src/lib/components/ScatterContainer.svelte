<script>
    //this is going to be a scatterplot that takes in two axes from a separate source
    //and will display the coordinating data
    import { scatterplotXvar, scatterplotYvar } from "../../stores/scatterplotControl";

    //right now, it's hardcoded
    import { LayerCake, Svg } from "layercake";
    import Tooltip from "./Tooltip.html.svelte";
    import ScatterSvg from "./LayercakeComponents/Scatter.svg.svelte";
    import AxisX from "./LayercakeComponents/AxisX.svelte";
    import AxisY from "./LayercakeComponents/AxisY.svelte";
    import ReturnToTop from "./ReturnToTop.svelte";
    import { activeLabel, activeTitle, activeFormat } from "../../stores/scatterplotControl";
    import resizeObserver from "$lib/actions/resizeObserver";

    import { isMapContainerActive } from "../../stores/activeFrame";
    import { flyToTract } from "../../stores/map";

    //get data here
    import data_from_file from "../../data/all_indicators.json";
    import { logClickToGA } from "$utils/analytics";

    //removes Olympia High Relief School and New Southeast Elementary Relief School so range doesn't go to zero
    $: data = data_from_file.filter(d => d.ncessch != 370297003622 && d.ncessch != 370297003623)

    let r = 7;

    let clickedBool = false;
    let clickedEvt = {
      yVal: 0,
      xVal: 0,
      detail: null,
    };

    let evt = {
      yVal: 0,
      xVal: 0,
      detail: null,
    };
    let clickedID = "";
    let hideTooltip = true;

    let plotArea; //for unclicking popup
    let height = 0; //used for setting NA position
    let width = 0; //used for setting NA position
    let outerHeight = 0;
    let outerWidth = 0;

    $: if ($scatterplotYvar && clickedBool && plotArea && plotArea.querySelector("#" + clickedID)) {
      if (clickedBool) {
        //need value post transition -- hate to do this, but not currently solved for, no "animationend" ie
        setTimeout(() => {
          let el = plotArea.querySelector("#" + clickedID);
          evt.yVal = parseInt(el.cy.animVal.value);
        }, 150);
      }
    }

    function removeSelection(e) {
      if (e.target && !e.target.matches("circle")) {
        clickedBool = false;
        if (clickedEvt) {
          clickedEvt.detail.e.target.classList.remove("selected");
        }
        hideTooltip = true;
        plotArea.removeEventListener("click", removeSelection);
      }
    }

    function clickScatterDot(e) {
      if (clickedBool) {
        //was there already something live
        clickedEvt.detail.e.target.classList.remove("selected");
      }

      clickedBool = true; //yes, we have a selection

      //set clickedEvt values
      clickedEvt.yVal = e.detail.e.target.cy.animVal.value;
      clickedEvt.xVal = e.detail.e.target.cx.animVal.value;
      clickedEvt.detail = e.detail;
      clickedID = e.detail.e.target.id;

      //set tooltip info values
      evt.yVal = e.detail.e.layerY;
      evt.xVal = e.detail.e.layerX;
      evt.detail = e.detail;

      //ring on selected circle
      e.detail.e.target.classList.add("selected");
      plotArea.addEventListener("click", removeSelection);

      logClickToGA(e.detail.e.target,"scatter_dot_clicked--"+clickedID)
    }

    function goToMap(dotData) {
      isMapContainerActive.set(true);
      flyToTract(dotData["ncessch"], dotData["geoid"]);
    }
  </script>

  <!--svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} /-->
  <div class="scatter-all" bind:this={plotArea}>
    <div class="title">
      Charlotte Schools’ Share of Students of Color, by <span class="underlined">{$activeTitle}</span>
    </div>
    <div class="legend-title">Share of students of color</div>
    <div class="legend-colors">
      <div class="tick light-stroke"/>
      <div class="square light-stroke" style="background-color: #CFE8F3;" />
      <div class="half-tick light-stroke"/>
      <div class="square light-stroke" style="background-color: #A2D4EC;" />
      <div class="tick light-stroke"/>
      <div class="square light-stroke" style="background-color: #73BFE2;" />
      <div class="half-tick light-stroke"/>
      <div class="square" style="background-color: #46ABDB;" />
      <div class="tick"/>
      <div class="square" style="background-color: #1696D2;" />
      <div class="half-tick"/>
      <div class="square" style="background-color: #12719E;" />
      <div class="tick"/>
      <div class="square" style="background-color: #0A4C6A;" />
      <div class="half-tick"/>
      <div class="square" style="background-color: #062635;" />
      <div class="tick"/>
    </div>
    <div class="legend-labels">
      <div class="label first" style:left="0">0%</div>
      <div class="label" style:left="25%">25%</div>
      <div class="label" style:left="50%">50%</div>
      <div class="label" style:left="75%">75%</div>
      <div class="label" style:left="100%">100%</div>
    </div>
    <div
      class="scatter-container"
      use:resizeObserver={(el) => (width = el.clientWidth, height = el.clientHeight)}
      role="figure"
      aria-label="Scatterplot of student demographics by housing data."
      bind:clientWidth={outerWidth} bind:clientHeight={outerHeight}
    >
      <LayerCake
        padding={{ top: 10, right: 5, bottom: 30, left: 15 }}
        x={$scatterplotXvar}
        y={$scatterplotYvar}
        xRange={[15, width - 15 - 5]}
        yRange={[height - 10 - 30, 10]}
        xDomain={[20, 100]}
        yNice={true}
        {data}
      >
        <Svg>
          <AxisX gridlines={false} formatTick={(tick) => `${tick}%`}/>
          <AxisY gridlines={true} ticks={10}
            formatTick={["tract_pct_nonwhite","test_sfh_pct"].includes($scatterplotYvar) ? d=> $activeFormat.format(d/100) : d=> $activeFormat.format(d)}
          />
          <ScatterSvg
            {r}
            on:mousemove={(event) => {
              if (event.detail.e.layerY != 0 && event.detail.e.layerX != 0)
                evt.yVal = event.detail.e.layerY;
              evt.xVal = event.detail.e.layerX;
              evt.detail = event.detail;
              hideTooltip = false;
            }}
            on:mouseout={() => {
              if (clickedBool) {
                evt.yVal = clickedEvt.detail.e.layerY;
                evt.xVal = clickedEvt.detail.e.layerX;
                evt.detail = clickedEvt.detail;
                hideTooltip = false;
              } else {
                hideTooltip = true;
              }
            }}
            on:click={clickScatterDot}
          />
        </Svg>
        <div class="tooltip-screen">
          {#if hideTooltip !== true}
            <Tooltip {evt} let:detail {outerHeight} {outerWidth}>
              <!-- For the tooltip, do another data join because the hover event only has the data from the geography data -->
              {@const tooltipData = { ...detail.props }}
              <div class="row">
                <div class="tooltip-title">{tooltipData.school_name}</div>
              </div>

              <div class="row">
                <div class="tooltip-detail">
                  {$activeLabel}:
                  {(["test_sfh_pct","tract_pct_nonwhite"].includes($scatterplotYvar)) ? $activeFormat.format(tooltipData[$scatterplotYvar]/100) : $activeFormat.format(tooltipData[$scatterplotYvar]) }
                </div>
              </div>

              <div class="row">
                <div class="tooltip-detail">
                  Students of color:
                  {Math.round(tooltipData[$scatterplotXvar])}%
                </div>
              </div>

              <div class="row">
                <div class="tooltip-detail">
                  Public school share:
                  {Math.round(tooltipData["market_share_total"] * 100)}%
                </div>
              </div>

              <div
                class="go_to_map"
                role="button"
                tabindex="0"
                on:click={(e) => {
                  goToMap(tooltipData);
                  logClickToGA(e.target,"scatter_dot_view_on_map--"+tooltipData["ncessch"]);
                }}
                on:keypress={(e) => {
                  goToMap(tooltipData);
                  logClickToGA(e.target,"scatter_dot_view_on_map--"+tooltipData["ncessch"]);
                }}
              >
                View full data →
              </div>
            </Tooltip>
          {/if}
        </div>
      </LayerCake>
    </div>
    <div class="return"><ReturnToTop elementId="toggle-bar" /></div>
  </div>

  <style>
    .tooltip-screen {
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .tooltip-screen:first-child {
      z-index: 9001;
    }
    .scatter-all {
      flex: 1 1 50%;
      position: relative;
      display: flex;
      flex-direction: column;
      height: 900px;
      margin-right: 15px;
      margin-left: 15px;
    }
    .scatter-container {
      flex: 5 1 auto;
      height: 850px;
      width: 100%;
      margin-bottom: 80px;
    }

    .title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
      margin-top: 25px;
    }
    .underlined {
      border-bottom: 2px solid #fdbf11;
      display: inline-block;
    }
    .legend-colors {
      display: flex;
      width: 50%;
      min-width: 300px;
      max-width: 100%;
    }

    .square {
      flex: 1 0 auto;
      height: 15px;
      border-color: #0A4C6A;
      border-width: .5px 0px .5px 0px;
      border-style: solid;
    }
    .tick{
      width: 0px;
      height: 23px;
      border-left: 1px solid #0A4C6A;
    }
    .half-tick{
      width: 0px;
      height: 17px;
      border-left: 1px solid #0A4C6A;
    }
    .light-stroke {
      border-color: #12719E;
    }

    .legend-labels{
      position: relative;
      height: 20px;
      width: 50%;
      min-width: 300px;
      max-width: 100%;
      font-size: 12px;
    }

    .label {
      position: absolute;
      transform: translate(-50%, 0);
      line-height: 130%;
    }
    .label:first-child {
      transform: translate(0, 0);
    }
    .label:last-child {
      transform: translate(-100%, 0);
    }
    .first{
      flex: 0 1 auto;
      text-align: left;
    }

    .tooltip-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .tooltip-detail {
      font-size: 14px;
    }

    .go_to_map {
      margin-top: 10px;
      color: #1696d2;
      font-weight: 700;
      cursor: pointer;
    }

    .go_to_map:hover {
      text-decoration: underline;
    }

    .return {
      display: none;
    }

    @media screen and (max-width: 900px) {
      .scatter-all {
        height: 800px;
      }
      .scatter-container {
        height: 850px;
      }
      .return {
        display: block;
      }
    }
    @media screen and (max-width: 768px) {
      .scatter-container {
        height: 800px;
      }
    }
  </style>
