<script>
  import { clamp } from "yootils";
  import {
    sliderMaxShare,
    sliderMinShare,
    sliderData,
    sliderMaxData,
    sliderMinData,
  } from "../../stores/slider";
  import resizeObserver from "$lib/actions/resizeObserver";

  export let start = 0;
  export let end = 1;

  let leftHandle;
  let body;
  let slider;
  let el;

  let x;
  let y;
  let allWidth;
  $: width = 0.98 * allWidth;

  function draggable(node) {
    // let x;
    // let y;
    function handleMousedown(event) {
      if (event.type === "touchstart") {
        event = event.touches[0];
      }
      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragstart", {
          detail: { x, y },
        })
      );
      window.addEventListener("mousemove", handleMousemove);
      window.addEventListener("mouseup", handleMouseup);
      window.addEventListener("touchmove", handleMousemove);
      window.addEventListener("touchend", handleMouseup);
    }
    function handleMousemove(event) {
      if (event.type === "touchmove") {
        event = event.changedTouches[0];
      }
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragmove", {
          detail: { x, y, dx, dy },
        })
      );
    }
    function handleMouseup(event) {
      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragend", {
          detail: { x, y },
        })
      );
      window.removeEventListener("mousemove", handleMousemove);
      window.removeEventListener("mouseup", handleMouseup);
      window.removeEventListener("touchmove", handleMousemove);
      window.removeEventListener("touchend", handleMouseup);
    }
    node.addEventListener("mousedown", handleMousedown);
    node.addEventListener("touchstart", handleMousedown);
    return {
      destroy() {
        node.removeEventListener("mousedown", handleMousedown);
        node.removeEventListener("touchstart", handleMousedown);
      },
    };
  }
  function setHandlePosition(which) {
    return function (evt) {
      const { left, right } = slider.getBoundingClientRect();
      const parentWidth = right - left;
      const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
      if (which === "start") {
        start = p;
        end = Math.max(end, p);
      } else {
        start = Math.min(p, start);
        end = p;
      }
      $sliderMaxShare = end;
      $sliderMinShare = start;
    };
  }
  function setHandlesFromBody(evt) {
    const { width } = body.getBoundingClientRect();
    const { left, right } = slider.getBoundingClientRect();
    const parentWidth = right - left;
    const leftHandleLeft = leftHandle.getBoundingClientRect().left;
    const pxStart = clamp(leftHandleLeft + evt.detail.dx - left, 0, parentWidth - width);
    const pxEnd = clamp(pxStart + width, width, parentWidth);
    const pStart = pxStart / parentWidth;
    const pEnd = pxEnd / parentWidth;
    start = pStart;
    end = pEnd;
    $sliderMaxShare = end;
    $sliderMinShare = start;
  }

  function incrementSlider(which, amount = 0.01) {
    if (which === "start") {
      if (start < 1 && start < end) {
        if (start + amount > end) {
          start = end;
        } else {
          start += amount;
        }
      }
    } else {
      if (end < 1) {
        if (end + amount > 1) {
          end = 1;
        } else {
          end += amount;
        }
      }
    }
    $sliderMaxShare = end;
    $sliderMinShare = start;
  }
  function decrementSlider(which, amount = 0.01) {
    if (which === "start") {
      if (start > 0) {
        if (start - amount < 0) {
          start = 0;
        } else {
          start -= amount;
        }
      }
    } else {
      if (end > 0 && end > start) {
        if (end - amount < start) {
          end = start;
        } else {
          end -= amount;
        }
      }
    }
    $sliderMaxShare = end;
    $sliderMinShare = start;
  }

  function resetSlider(which) {
    if (which === "start") {
      start = 0;
    } else {
      end = 1;
    }
    $sliderMaxShare = end;
    $sliderMinShare = start;
  }

  function maxSlider(which) {
    if (which === "start") {
      start = Math.min(1, end);
    } else {
      end = Math.max(0, start);
    }
    $sliderMaxShare = end;
    $sliderMinShare = start;
  }

  /**
   * @param {KeyboardEvent} e
   * @param {string} which
   * @returns {void}
   */
  function handleKeydown(e, which) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      incrementSlider(which);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      decrementSlider(which);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      decrementSlider(which, 0.1);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      incrementSlider(which, 0.1);
    } else if (e.key === "Home") {
      e.preventDefault();
      resetSlider(which);
    } else if (e.key === "End") {
      e.preventDefault();
      maxSlider(which);
    }
  }
</script>

<div
  class="double-range-container"
  use:resizeObserver={(element) => (allWidth = element.clientWidth)}
  bind:this={el}
>
  <div class="label-container">
    <div class="label" style="left: {start * width}px;">{Math.round(100 * $sliderMinData)}%</div>
    <div class="label" style="left: {end * width}px;">{Math.round(100 * $sliderMaxData)}%</div>
  </div>
  <div class="slider" bind:this={slider}>
    <div
      class="body"
      bind:this={body}
      use:draggable
      on:dragmove|preventDefault|stopPropagation={setHandlesFromBody}
      style="
				left: {100 * start}%;
				right: {100 * (1 - end)}%;
			"
    />
    <div
      class="handle"
      tabindex="0"
      role="slider"
      aria-valuenow={$sliderMinShare}
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuetext={`${Math.round($sliderMinShare * 100)}%`}
      bind:this={leftHandle}
      data-which="start"
      use:draggable
      on:keydown={(e) => {
        handleKeydown(e, "start");
      }}
      on:dragmove|preventDefault|stopPropagation={setHandlePosition("start")}
      style:left="{100 * start}%"
    />
    <div
      class="handle"
      data-which="end"
      role="slider"
      tabindex="0"
      aria-valuenow={$sliderMaxShare}
      aria-valuetext={`${Math.round($sliderMaxShare * 100)}%`}
      aria-valuemin={0}
      aria-valuemax={1}
      use:draggable
      on:keydown={(e) => {
        handleKeydown(e, "end");
      }}
      on:dragmove|preventDefault|stopPropagation={setHandlePosition("end")}
      style:left="{100 * end}%"
    />
  </div>
  <div class="label-container lower">
    <div class="label" style="left: 0px;">{Math.round(100 * $sliderData.min)}%</div>
    <div class="label" style="left: {0.25 * width}px;">
      {Math.round(25 * $sliderData.range + $sliderData.min)}%
    </div>
    <div class="label" style="left: {0.5 * width}px;">
      {Math.round(50 * $sliderData.range + $sliderData.min)}%
    </div>
    <div class="label" style="left: {0.75 * width}px;">
      {Math.round(75 * $sliderData.range + $sliderData.min)}%
    </div>
    <div class="label" style="left: {width}px;">{Math.round(100 * $sliderData.max)}%</div>
  </div>
</div>

<style>
  .double-range-container {
    width: calc(100% - 30px);
    height: 90px;
    margin-top: 10px;
    user-select: none;
    box-sizing: border-box;
    white-space: nowrap;
    position: relative;
  }
  .slider {
    position: relative;
    width: 98%;
    height: 6px;
    margin-top: 8px;
    margin-bottom: 8px;
    top: 15px;
    left: 10px;
    transform: translate(0, -50%);
    background-color: #e3e3e3;
    border-radius: 3px;
  }
  .handle {
    position: absolute;
    width: 26px;
    height: 26px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .handle:after {
    content: " ";
    box-sizing: border-box;
    position: absolute;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    background-color: #fdfdfd;
    border: 1px solid #7b7b7b;
  }
  /* .handle[data-which="end"]:after{
		transform: translate(-100%, -50%);
	} */
  .handle:active:after {
    background-color: #ddd;
    z-index: 9;
  }
  .body {
    top: 0;
    position: absolute;
    background-color: #1696d2;
    bottom: 0;
  }

  .label-container {
    position: relative;
    height: 20px;
  }
  .label {
    position: absolute;
    top: 0px;
    left: 40px;
  }

  .lower {
    top: 20px;
    height: 20px;
  }
</style>
