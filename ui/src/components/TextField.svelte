<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let label;
  export let value;
  export let errorMsg = "";
  export let type = "text";
  export let required = true;
  export let placeholder = "";

  const enterKey = key => key.code === "Enter" && dispatch("enterKey");
  const handleInput = e => {
    // in here, you can switch on type and implement
    // whatever behaviour you need
    value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
  };
</script>

<label
  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
  {label}
</label>
<input
  class="appearance-none block w-full text-gray-700 border border-gray-300
  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white
  focus:border-gray-500"
  {placeholder}
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
