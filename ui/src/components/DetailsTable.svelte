<script>
  import { groupBy, props } from "ramda";
  import DetailsByDest from "./DetailsByDest.svelte";
  import ParsedQuery from "query-string";
  import { updateQuery } from "../utils/utils.js";
  import DetailsBySource from "./DetailsBySource.svelte";
  import DetailsByReason from "./DetailsByReason.svelte";
  import { onMount } from "svelte";

  export let builds = [];
  export let currentRoute;

  const options = [DetailsBySource, DetailsByDest, DetailsByReason];
  let selected = options[0];
  let displayMode = 0;

  const changeMode = m => {
    displayMode = m;
    selected = options[m];
    updateQuery(ParsedQuery.stringify({ displayMode }));
  };

  onMount(() => {
    if (currentRoute && currentRoute.queryParams.displayMode) {
      changeMode(+currentRoute.queryParams.displayMode);
    }
  });
</script>

<style>
  .active {
    background: white;
    border-radius: 9999px;
    color: #63b3ed;
  }
</style>

{#if builds.length === 0}
  <div class="mb-6 text-center text-xl py-8">
    <svg
      fill="none"
      width="27"
      height="27"
      class="text-yellow-800 inline-block"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
    There is no broken links in this build!!
    <svg
      fill="none"
      width="27"
      height="27"
      class="text-yellow-800 inline-block"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  </div>
{:else}
  <div class="my-4 mx-auto">
    <div
      class="bg-gray-200 text-sm text-gray-500 leading-none border-2
      border-gray-200 rounded-full inline-flex">
      <button
        on:click={() => changeMode(0)}
        class:active={displayMode === 0}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-l-full px-4 py-2">
        <span>By Source</span>
      </button>
      <button
        on:click={() => changeMode(1)}
        class:active={displayMode === 1}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-r-full px-4 py-2">
        <span>By Destination</span>
      </button>
      <button
        on:click={() => changeMode(2)}
        class:active={displayMode === 2}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-r-full px-4 py-2">
        <span>By Status</span>
      </button>
    </div>

  </div>

  <svelte:component this={selected} {builds} on:ignore />
{/if}
