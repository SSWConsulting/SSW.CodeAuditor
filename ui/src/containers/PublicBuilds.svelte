<script>
  import { userApi, userSession$, isLoggedIn } from "../stores";
  import { onDestroy } from "svelte";
  import marked from "marked";
  import Icon from "../components/Icon.svelte";
  import firebase from "firebase/app";
  import BuildList from "../components/BuildList.svelte";
  import LoadingFlat from "../components/LoadingFlat.svelte";

  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS, truncate } from "../utils/utils.js";

  let canClose;
  let lastBuild;

  async function getLastBuilds() {
    const res = await fetch(`${CONSTS.API}/api/scans`);
    const result = await res.json();
    if (res.ok) {
      return sort(descend(prop("buildDate")), result);
    } else {
      throw new Error("Failed to load");
    }
  }

  let promise = getLastBuilds();

  async function getAllBuilds() {
    const res = await fetch(`${CONSTS.API}/api/allscans`);
    const result = await res.json();
    if (res.ok) {
      return sort(descend(prop("buildDate")), result);
    } else {
      throw new Error("Failed to load");
    }
  }

  let promiseAllScan = getAllBuilds();

  let allScan = false;
  function showAllScan() {
    allScan = true;
  }

  const notLoggedIn = `
  ## Explore SSW CodeAuditor
  Showing last 100 public scans - [See all](https://codeauditor.com/login)
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
        {#await promiseAllScan}
          <LoadingFlat />
        {:then data}
          <p
            class="cursor-pointer underline text-gray-700 font-sans font-bold hover:text-red-600"
            on:click={showAllScan}>
            Showing all
            {data.length}
            Public Scans
          </p>
        {:catch error}
          <p style="color: red">{error.message}</p>
        {/await}
      </article>
    {/if}
  </div>

  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if allScan === true}
      {#await promiseAllScan}
        <LoadingFlat />
      {:then data}
        {#if data}
          <BuildList builds={data} {lastBuild} />
        {/if}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    {:else}
      {#await promise}
        <LoadingFlat />
      {:then data}
        {#if data}
          <BuildList builds={data} {lastBuild} />
        {/if}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    {/if}
  </div>
</div>
