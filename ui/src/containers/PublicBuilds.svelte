<script>
  import { isLoggedIn } from "../stores";
  import marked from "marked";
  import BuildList from "../components/buildlistcardcomponents/BuildList.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";

  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  let canClose;
  let lastBuild;

  async function getLastBuilds() {
    const res = await fetch(`${CONSTS.API}/api/allscans`);
    const result = await res.json();
    if (res.ok) {
      return sort(descend(prop("buildDate")), result);
    } else {
      throw new Error("Failed to load");
    }
  }

  let promise = getLastBuilds();

  const notLoggedIn = `
  ## Explore SSW CodeAuditor
  Showing all Public Scans - [See all](https://codeauditor.com/login)
  `;

  const isLoggedInMsg = `
  ## Explore SSW CodeAuditor
  `;
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    {#if !$isLoggedIn}
      <article class="markdown-body">
        {@html marked(notLoggedIn)}
      </article>
    {:else}
      <article class="markdown-body">
        {@html marked(isLoggedInMsg)}
      </article>
    {/if}
  </div>

  <div class="bg-white rounded px-4 pt-2 mb-12 flex flex-col">
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
