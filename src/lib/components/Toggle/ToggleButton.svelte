<script>
  /**
   * Whether the toggle is active or not
   * @type {boolean}
   **/
  export let is_active = false;
  /**
   * Label for the toggle
   * @type {string}
   **/
  export let label = "Toggle";
  /**
   * Value for the toggle
   * @type {string}
   **/
  export let value = "toggle";

  export let disabled = false;
</script>

<button class="toggle-button" {disabled} aria-pressed={is_active} on:click
  ><span class="toggle-wrapper" aria-hidden="true"><span class="toggle-button-button" /></span>
  <p class="toggle-text">{label}</p></button
>

<style>
  .toggle-button {
    appearance: none;
    background: none;
    border: none;
    color: var(--color-black);
    display: inline-flex;
    justify-content: start;
    align-items: center;
    cursor: pointer;
  }
  .toggle-button:disabled {
    opacity: 0.5;
  }
  .toggle-text {
    display: inline-block;
    margin-bottom: 0;
    margin-left: 6px;
    text-align: left;
    font-size: var(--font-size-small);
  }

  button[aria-pressed="true"] {
    /* color: red; */
  }

  .toggle-wrapper {
    display: inline-block;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-shade-light);
    position: relative;
    transition: background-color 250ms ease border 250ms ease;
  }
  .toggle-button-button {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: var(--color-gray-shade-light);
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(2px, 2px);
    transition: transform 250ms ease;
  }
  button[aria-pressed="true"] .toggle-wrapper {
    background-color: #2297cf;
    border: 1px solid #2297cf;
  }
  button[aria-pressed="true"] .toggle-button-button {
    background-color: var(--color-white);
    left: none;
    transform: translate(17px, 2px);
  }
</style>
