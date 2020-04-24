<script>
  import TextField from "./TextField.svelte";
  import { fade, fly } from "svelte/transition";
  export let value = [];
  export let label;
  export let avgRate;
  export let discountedRate;
  const remove = i => {
    value.splice(i, 1);
    value = value;
  };
  $: totalHours = value.reduce((current, pre) => current + pre.est, 0);
</script>

<label
  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
  {label}
</label>
{#if value.length === 0}
  <div class="md:flex md:items-center mb-6 italic">List empty</div>
{:else}
  {#each value as val, i}
    <div
      in:fly={{ y: 100, duration: 400 }}
      out:fly={{ x: -100, duration: 400 }}
      class="md:flex md:items-center mb-6">
      <div class="w-1/12">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name">
          {i + 1}.
        </label>
      </div>
      <div class="w-full md:w-8/12">
        <input
          class="appearance-none block w-full text-gray-700 border
          border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none
          focus:bg-white focus:border-gray-500"
          type="text"
          placeholder="Task Description"
          bind:value={val.name} />
      </div>
      <div class="w-1/2 md:ml-3 md:w-2/12 my-2 md:my-0">
        <input
          class="appearance-none block w-full text-gray-700 border
          border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none
          focus:bg-white focus:border-gray-500"
          type="number"
          min="2"
          step="2"
          max="24"
          placeholder="Est. Hours"
          bind:value={val.est} />
      </div>
      <div class="w-1/2 md:ml-3 md:w-1/12">
        <label class="w-full block text-gray-500">
          <input
            class="mr-2 leading-tight"
            type="checkbox"
            bind:checked={val.mvp} />
          <span
            class="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Is MVP?
          </span>
        </label>
      </div>
      <div class="md:w-1/8 md:ml-3 my-2 md:my-0">
        <button
          on:click|preventDefault={() => remove(i)}
          class="bg-transparent hover:bg-blue-500 text-red-700 font-semibold
          hover:text-white py-2 px-4 border border-red-500
          hover:border-transparent rounded">
          Delete
        </button>
      </div>

    </div>
  {/each}
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      <label
        class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
        for="inline-full-name">
        Total Hours:
      </label>
    </div>
    <div class="w-1/8">{totalHours} Hours</div>

  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      <label
        class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4 "
        for="inline-full-name">
        Total (Standard)
      </label>
    </div>
    <div class="w-1/8">
      ${new Intl.NumberFormat('en-AU').format(totalHours * avgRate)}
    </div>

  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/8">
      <label
        class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4 "
        for="inline-full-name">
        Total (Discounted)
      </label>
    </div>
    <div class="w-1/8">
      ${new Intl.NumberFormat('en-AU').format(totalHours * discountedRate)}
    </div>
  </div>
{/if}
