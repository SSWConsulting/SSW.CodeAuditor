<script>
  import { onMount, onDestroy } from "svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  import {
    getBuildDetails,
    userApi,
    userSession$,
    getIgnoreList
  } from "../stores";
  import LighthouseDetailsCard from "../components/LighthouseDetailsCard.svelte";
  export let currentRoute;
  let loading;

  let promise = getBuildDetails(currentRoute.namedParams.run);
  let runId;

  onMount(() => {
    if (currentRoute && currentRoute.namedParams.run) {
      loading = true;
      runId = currentRoute.namedParams.run;
      fetch(
        `https://urlchecker.blob.core.windows.net/lhr/${currentRoute.namedParams.run}.json`
      )
        .then(x => x.json())
        .then(json => {
          loading = false;
          const dom = new DOM(document);
          const renderer = new ReportRenderer(dom);
          const container = document.querySelector("#report");
          renderer.renderReport(json, container);
        });
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    <p class="pb-2">
      <svg
        class="inline-block"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        height="20"
        width="20"
        viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        Builds
      </a>
      <svg
        class="inline-block"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        height="20"
        width="20"
        viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        <Navigate to={`/build/${runId}`}>{runId}</Navigate>
      </a>
      <svg
        class="inline-block"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        height="20"
        width="20"
        viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
      <span
        class="inline-block align-baseline text-blue hover:text-blue-darker">
        Lighthouse Report
      </span>
    </p>

    {#if loading}
      <LoadingFlat />
    {:else}
      {#await promise}
        <LoadingFlat />
      {:then data}
        <LighthouseDetailsCard build={data ? data.summary : {}} />
      {:catch error}
        <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
      {/await}
    {/if}
    <!-- this is where the lighthouse report will go -->
    <main id="report" />
  </div>
</div>
