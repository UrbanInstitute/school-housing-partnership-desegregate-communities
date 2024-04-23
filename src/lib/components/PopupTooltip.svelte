<script>
  import { logClickToGA } from "$utils/analytics";

  export let text = ""
  export let popupID = "any"
  export let placementBelow = true

  let popup;
  let icon;
  let open = false;

  function isEventInPopup(e) {
    if (!open) {
      //it trickles down and calls on first click always, so just handle it here
      logClickToGA(e.target,"popup_click--open_"+popupID)
      open = true;
      return;
    }
    if (!popup.contains(e.target)) {
      open = false;
      logClickToGA(e.target,"popup_click--close_"+popupID)
      document.removeEventListener("click", isEventInPopup);
    }
  }

  function handleIconClick(e) {
    if (!open) {
      document.addEventListener("click", isEventInPopup);
    }
  }
</script>

<div class="tooltip-group">
  <button
      class="info"
      aria-label="show popup"
      tabindex="0"
      on:click={handleIconClick}
      bind:this={icon}
    >
      <span class="info-label">{open ? "X" : "i"}</span>
    </button>
    {#if open}
      <div class="popup {placementBelow ? 'bottom' : 'corner'}" bind:this={popup}>
        <span class="popup-text">{@html text}</span>
      </div>
    {/if}
</div>


<style>
  .tooltip-group{
    position: relative;
    display: inline-block;
  }

  .info {
    cursor: pointer;
    width: 20px;
    height: 20px;
    position: relative;
    margin-left: 7px;
    border-radius: 50%;
    border-width: 0px;
    display: inline-block;
    color: white;
    background-color: black;
    font-size: 13px;
    line-height: 1;
    font-weight: 900;
    text-align: center;
    vertical-align: middle;
    user-select: none;
  }
  .info-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .popup {
    position: absolute;
    padding: 10px;
    width: 220px;
    background-color: black;
    color: white;
    z-index: 4;
  }
  .bottom {
    left: -110px;
    top: 30px;
  }
  .corner {
    bottom: 20px;
    right: 20px;
    width: 250px;
  }
  .popup-text {
    flex: 0 1 auto;
    font-size: 14px;
  }

</style>