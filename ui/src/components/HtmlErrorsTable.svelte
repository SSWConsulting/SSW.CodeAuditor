<script>
  import { groupBy, props } from "ramda";
  import DetailsByDest from "./DetailsByDest.svelte";
  import { updateQuery } from "../utils/utils.js";
  import Icon from "./Icon.svelte";
  import ParsedQuery from "query-string";
  import HtmlErrorsBySource from "./HtmlErrorsBySource.svelte";
  import HtmlErrorsByReason from "./HtmlErrorsByReason.svelte";
  import DetailsByReason from "./DetailsByReason.svelte";
  import { onMount } from "svelte";

  export let errors = [];
  export let currentRoute;

  let displayMode = 0;

  const changeMode = m => {
    displayMode = m;
    updateQuery(ParsedQuery.stringify({ displayMode }));
  };

  onMount(() => {
    if (currentRoute && currentRoute.queryParams.displayMode) {
      setTimeout(() => {
        changeMode(+currentRoute.queryParams.displayMode);
      }, 0);
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

{#if errors.length === 0}
  <div class="mb-6 text-center text-xl py-8">
    <Icon cssClass="text-yellow-800 inline-block">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </Icon>
    There is no HTML issues found in this build!!
    <Icon cssClass="text-yellow-800 inline-block">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </Icon>
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
        <span>By Page</span>
      </button>
      <button
        on:click={() => changeMode(1)}
        class:active={displayMode === 1}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-r-full px-4 py-2">
        <span>By Reason</span>
      </button>
    </div>

  </div>

  {#if displayMode === 0}
    <HtmlErrorsBySource {errors} />
  {:else}
    <HtmlErrorsByReason {errors} />
  {/if}
{/if}
