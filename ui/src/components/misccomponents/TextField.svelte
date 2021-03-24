<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let label;
  export let value = "";
  export let errorMsg = "";
  export let type = "text";
  export let autocomplete = "";
  export let required = true;
  export let placeholder = "";

  const enterKey = key => key.code === "Enter" && dispatch("enterKey");
  const handleInput = e => {
    // in here, you can switch on type and implement
    // whatever behaviour you need
    value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
  };
</script>

<style>
  input[type="range"] {
    -webkit-appearance: none;
    margin: 18px 0;
    width: 100%;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #8cb9dd;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type="range"]::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -14px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #367ebd;
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #8cb9dd;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: #8cb9dd;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]::-ms-fill-upper {
    background: #8cb9dd;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: #8cb9dd;
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: #367ebd;
  }
</style>

<label
  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
  {label}
</label>
<input
  class="appearance-none block w-full text-gray-700 border border-gray-300
  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white
  focus:border-gray-500"
  {placeholder}
  {autocomplete}
  {value}
  class:border-red-300={(required && !value) || errorMsg}
  class:focus:border-red-500={(required && !value) || errorMsg}
  on:input={handleInput}
  on:keydown={enterKey}
  {type} />

{#if required && !value}
  <p class="text-red-500 text-xs italic">This field is required</p>
{/if}

{#if errorMsg && value}
  <p class="text-red-500 text-xs italic">{errorMsg}</p>
{/if}
