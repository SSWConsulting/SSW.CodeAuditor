<script>
  import { groupBy, props } from "ramda";
  import DetailsByDest from "./DetailsByDest.svelte";
  import Modal from "../components/Modal.svelte";
  import SelectField from "../components/SelectField.svelte";
  import ParsedQuery from "query-string";
  import { updateQuery } from "../utils/utils.js";
  import DetailsBySource from "./DetailsBySource.svelte";
  import DetailsByReason from "./DetailsByReason.svelte";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  export let builds = [];
  export let summary = {};
  export let currentRoute;

  const dispatch = createEventDispatcher();
  const options = [DetailsBySource, DetailsByDest, DetailsByReason];
  const ignoreDurations = [
    { value: 3, label: "3 days" },
    { value: 7, label: "1 week" },
    { value: 14, label: "2 weeks" },
    { value: 30, label: "1 month" },
    { value: -1, label: "Permanently" }
  ];
  let ignoreDuration = 3;
  let selected = options[0];
  let displayMode = 0;
  let show;
  let urlToIgnore;
  let ignoreOn = "all";

  const changeMode = m => {
    displayMode = m;
    selected = options[m];
    updateQuery(ParsedQuery.stringify({ displayMode }));
  };

  const updateIgnore = () => {
    show = false;
    dispatch("ignore", { urlToIgnore, ignoreDuration, ignoreOn });
  };

  const ignore = url => {
    urlToIgnore = url.detail;
    show = true;
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

  input[type="radio"] + label span {
    transition: background 0.2s, transform 0.2s;
  }

  input[type="radio"] + label span:hover,
  input[type="radio"] + label:hover span {
    transform: scale(1.2);
  }

  input[type="radio"]:checked + label span {
    background-color: #3490dc;
    box-shadow: 0px 0px 0px 2px white inset;
  }

  input[type="radio"]:checked + label {
    color: #3490dc;
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

  <svelte:component this={selected} {builds} on:ignore={ignore} />
{/if}
<Modal bind:show header="Ignore" mainAction="Save" on:action={updateIgnore}>
  <a
    class="inline-block align-baseline text-blue-600 hover:text-blue-800 pb-5
    pl-5 text-lg"
    target="_blank"
    href={urlToIgnore}>
    {urlToIgnore}
  </a>
  <ul class="ml-5">
    <li class="pb-3">
      <div class="flex items-center mr-4 mb-4">
        <input
          id="radio1"
          type="radio"
          class="hidden"
          value={'all'}
          bind:group={ignoreOn} />

        <label for="radio1" class="flex items-center cursor-pointer text-lg">
          <span
            class="w-6 h-6 inline-block mr-2 rounded-full border border-grey
            flex-no-shrink" />
          For all new builds
        </label>
      </div>
    </li>
    <li>
      <div class="flex items-center mr-4 mb-4">
        <input
          type="radio"
          class="hidden"
          id="radio2"
          bind:group={ignoreOn}
          value={summary.url} />
        <label for="radio2" class="flex items-center cursor-pointer text-lg">
          <span
            class="w-6 h-6 inline-block mr-2 rounded-full border border-grey
            flex-no-shrink" />
          Only when {summary.url} is scanned
        </label>
      </div>
    </li>
    <SelectField
      bind:value={ignoreDuration}
      label="For:"
      allowNull={false}
      options={ignoreDurations} />
  </ul>
</Modal>
