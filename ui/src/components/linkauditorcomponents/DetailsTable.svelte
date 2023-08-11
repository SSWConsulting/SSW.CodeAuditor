<script>
  import DetailsByDest from "./DetailsByDest.svelte";
  import { updateQuery } from "../../utils/utils.js";
  import Icon from "../misccomponents/Icon.svelte";
  import ParsedQuery from "query-string";
  import DetailsBySource from "./DetailsBySource.svelte";
  import DetailsByReason from "./DetailsByReason.svelte";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let builds = [];
  export let currentRoute;
  export let unscannableLinks;
  
  let foundUnscannableLinks = [];
  foundUnscannableLinks = builds.filter(build => unscannableLinks.some(link => build.dst.includes(link.url)));
  
  // Filter out unscannable links
  builds = builds.filter(build => !unscannableLinks.some(link => build.dst.includes(link.url)));

  let displayMode = 0;

  const changeMode = m => {
    displayMode = m;
    updateQuery(ParsedQuery.stringify({ displayMode }));
  };

  const dispatch = createEventDispatcher();
  const download = () => dispatch("download");

  onMount(() => {
    if (currentRoute && currentRoute.queryParams.displayMode) {
      changeMode(+currentRoute.queryParams.displayMode);
    }
  });

  let hiddenRows = false;
  const hideShow = () => {
    hiddenRows = !hiddenRows
  }
</script>

<style>
  .active {
    background: white;
    color: #cc4141;
  }
  .active:focus {
    color: #cc4141;
  }
  .active:visited {
    color: #cc4141;
  }
  .table-header {
    text-align: right;
    background: #eee;
    border-style: solid;
    border-color: #ccc;
    border-width: 1px;
  }
</style>

{#if builds.length === 0}
  <div class="mb-6 text-center text-xl py-8">
    <Icon cssClass="inline-block">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </Icon>
    No broken links in this build!
    <Icon cssClass="inline-block">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
        21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </Icon>
  </div>
{:else}
  <div class="my-4">
    <div
      class="bggrey text-sm textgrey leading-none border-2 border-gray-200
      rounded-full inline-flex">
      <button
        on:click={() => changeMode(0)}
        class:active={displayMode === 0}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none rounded-l-full px-4 py-2">
        <span>By Source</span>
      </button>
      <button
        on:click={() => changeMode(1)}
        class:active={displayMode === 1}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none px-4 py-2">
        <span>By Destination</span>
      </button>
      <button
        on:click={() => changeMode(2)}
        class:active={displayMode === 2}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none rounded-r-full px-4 py-2">
        <span>By Status</span>
      </button>
    </div>
    <div class="float-right">
      <button
        on:click={download}
        title="Download CSV"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-1
        rounded-lg inline-flex items-center">
        <Icon cssClass="">
          <path
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </Icon>
      </button>
    </div>
  </div>
  {#if foundUnscannableLinks.length > 0}
    <span class="font-bold mb-3">
      <Icon
          on:click={() => hideShow()}
          cssClass="inline-block cursor-pointer">
          {#if !hiddenRows}
            <path d="M19 9l-7 7-7-7" />
          {:else}
            <path d="M9 5l7 7-7 7" />
          {/if}
        </Icon>
      Unscannable Links:
    </span>
    {#if !hiddenRows}
      <span class="mb-3">
        Some working links are reported as broken by CodeAuditor. They're marked as "unscannable". <a class="link hover:text-red-600" href="https://github.com/SSWConsulting/SSW.CodeAuditor/wiki/SSW-CodeAuditor-Knowledge-Base-(KB)#known-websites-that-has-anti-web-scraping-measures">Learn more on our KB.</a>
      </span>
      {#each foundUnscannableLinks as url}
        <table 
          class="table-fixed w-full md:table-auto mb-8"
          in:fade={{ y: 100, duration: 400 }}
          out:fade={{ y: -100, duration: 200 }}>
          <tbody>
            <tr>
              <th class="table-header hidden md:table-cell w-2/12 px-4 py-2">Source</th>
              <td class="w-10/12 border px-4 py-2 break-all">
                <a class="inline-block align-baseline link md:truncate" target="_blank" href={url.src}>{url.src.length < 70 ? url.src : url.src.substring(0, 70) + '...'}</a>
              </td> 
            </tr>
          
            <tr>
              <th class="table-header hidden md:table-cell w-2/12 px-4 py-2">Anchor Text</th>
              <td class="hidden md:table-cell w-10/12 border px-4 py-2 break-all">{url.link || ''}</td>
            </tr>
            <tr>
              <th class="table-header w-2/12 px-4 py-2">Unscannable Link</th> 
              <td class="w-10/12 border px-4 py-2 break-all"><a class="inline-block align-baseline link md:truncate" target="_blank" href={url.dst}>{url.dst.length < 70 ? url.dst : url.dst.substring(0, 70) + '...'}</a></td>    
            </tr>
          </tbody>
        </table>
      {/each}
    {/if}
  {/if}

  {#if displayMode === 0}
    <DetailsBySource {builds} on:ignore />
  {:else if displayMode === 1}
    <DetailsByDest {builds} on:ignore />
  {:else}
    <DetailsByReason {builds} on:ignore />
  {/if}
{/if}
