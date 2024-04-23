<script>
    import { logClickToGA } from "$utils/analytics";
import { metricLabel, metricToggle, metricFormat } from "../../stores/choroplethToggle";
    import { colorBreaks, colors } from "../../stores/map";

    let open = false;
    $: range = colorBreaks[$metricToggle][colorBreaks[$metricToggle].length - 1] - colorBreaks[$metricToggle][0]

    function formatLabel(d) {
        let lab; 
        if (["tract_pct_nonwhite","public_housing_share"].includes($metricToggle)){
            lab = $metricFormat.format(d/100)
        } else {
            lab = $metricFormat.format(d)
        }
        return lab
    }
    
    function getXpos(set,i) {
        if (i == 0) return 0;
        if (i == set.length - 1) return 100;
        return (set[i] - set[0])/(range)*100;
    }
    function getSquareWidth(set,i){
        return (set[i] - set[i - 1])/(range)*100;
    }
    
</script>

<div class="container {open ? 'open' : ''}">
    <div class = "inside">
        <div class = "title">{open ? $metricLabel : "Legend"}</div>
        {#if open}
        <div class = "legend-colors">
            <div class="tick"/>
            <div class="square" style="background-color: {colors[0]}; width: {getSquareWidth(colorBreaks[$metricToggle],1)}%;" />
            <div class="tick"/>
            <div class="square" style="background-color: {colors[1]}; width: {getSquareWidth(colorBreaks[$metricToggle],2)}%;" />
            <div class="tick"/>
            <div class="square" style="background-color: {colors[2]}; width: {getSquareWidth(colorBreaks[$metricToggle],3)}%;" />
            <div class="tick"/>
            <div class="square" style="background-color: {colors[3]}; width: {getSquareWidth(colorBreaks[$metricToggle],4)}%;" />
            <div class="tick"/>
            <div class="square" style="background-color: {colors[4]}; width: {getSquareWidth(colorBreaks[$metricToggle],5)}%;" />
            <div class="tick"/>
        </div>
        <div class = "legend-labels">

            {#each colorBreaks[$metricToggle] as label, i}
            <div class="label first" style:left="{getXpos(colorBreaks[$metricToggle],i)}%">{formatLabel(label)}</div>
            {/each}

        </div>
        {/if}
    </div>
    <button class = "openclose" on:click = {e => {open = !open; logClickToGA(e.target,"map_legend_open_close--"+(open==true ? "opened" : "closed"))}}>
        <img class = "icon" style="transform: rotate({open ? 180 : 0}deg);" src="./double-chevron-right.svg" alt=""/>
    </button>
</div>

<style>
    .container {
        display: flex;
        transition: 100ms ease-in-out;
        width: fit-content;
        background-color: white;
        position: relative;
        left: 30px;
        bottom: 70px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
    .open {
        bottom: 110px;
        min-width: 300px;
        max-width: 100%;
        width: 90%;
    }
    .inside{
        flex: 1 0 auto;
        padding: 7px 14px;
    }
    .openclose {
        flex: 0 1 auto;
        display: flex;
        width: 30px;
        background-color: #9d9d9d;
        justify-content: center;
        align-items: center;
    }
    .openclose:hover {
        background-color: #1696D2;
    }
    .icon{
        transition : 10ms ease-in-out;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
    }
    .legend-colors {
      display: flex;
      width: 100%;
    }

    .square {
      flex: 1 0 auto;
      height: 15px;
      border-color: #696969;
      border-width: .5px 0px .5px 0px;
      border-style: solid;
      opacity: .7;
    }
    .tick{
      width: 0px;
      height: 23px;
      border-left: 1px solid #696969;
    }

    .legend-labels{
      position: relative;
      height: 20px;
      width: 100%;
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


</style>