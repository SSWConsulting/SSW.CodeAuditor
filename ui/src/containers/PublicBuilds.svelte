<script>
  import { isLoggedIn } from "../stores";
  import * as marked from "marked";
  import BuildList from "../components/buildlistcardcomponents/BuildList.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  let lastBuild;
  let showAllScan = false;

  async function getLastBuilds() {
    const res = await fetch(`${CONSTS.API}/api/allscans?showAll=${showAllScan}`);
    const result = await res.json();
    if (res.ok) {
      return sort(descend(prop("buildDate")), result);
    } else {
      throw new Error("Failed to load");
    }
  }

  let promise = getLastBuilds();

  const toggleShowAllScan = () => {
    showAllScan = true;
    promise = getLastBuilds();
  }

  const notLoggedIn = `
  ## Explore SSW CodeAuditor
  Showing all Public Scans - [See all](https://codeauditor.com/login)
  `;

  const isLoggedInMsg = `
  ## Explore SSW CodeAuditor
  `;

  const topScanTitle = `
  ### Latest Public Scans
  `;
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-6 mb-4 flex flex-col">
    {#if !$isLoggedIn}
      <article class="markdown-body">
        {@html marked.parse(notLoggedIn)}
      </article>
    {:else}
      <article class="markdown-body">
        {@html marked.parse(isLoggedInMsg)}
      </article>
    {/if}
    {#if !showAllScan}
      <article class="markdown-body mt-5">
        {@html marked.parse(topScanTitle)}
      </article>
    {/if}
  </div>

  <div class="bg-white rounded px-4 pt-2 mb-12 flex flex-col">
    {#if !showAllScan}
      <span class="text-right">
        <a
          href={'#'}
          on:click={() => toggleShowAllScan()}
          class="cursor-pointer underline text-sm text-blue font-bold
        pb-6 hover:text-red-600">
          Show all Public Scans
        </a>
      </span>
    {/if}
    {#await promise}
      <LoadingFlat />
    {:then data}
      {#if data}
        <BuildList builds={data} {lastBuild} />
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
