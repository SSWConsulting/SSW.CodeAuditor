<script>
  export let label;
  export let options = [];
  export let value;
  export let allowNull = true;
  export let errorMsg = "";
  export let required = true;
</script>

<label
  for={undefined}
  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
  {label}
</label>
<select
  bind:value
  class="appearance-none block w-full text-gray-700 border border-gray-300
  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white
  focus:border-gray-500">
  {#if allowNull}
    <option value={null}>Please Select</option>
  {/if}
  {#each options as question}
    <option value={question.value}>{question.label}</option>
  {/each}
</select>

{#if required && !value}
  <p class="text-red-500 text-xs italic">This field is required</p>
{/if}

{#if errorMsg && value}
  <p class="text-red-500 text-xs italic">{errorMsg}</p>
{/if}
