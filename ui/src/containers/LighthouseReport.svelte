<script>
  import { onMount, onDestroy } from "svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  import Icon from "../components/Icon.svelte";
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
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        Builds
      </a>
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
      <a
        class="inline-block align-baseline text-blue hover:text-blue-darker"
        href="/">
        <Navigate to={`/build/${runId}`}>{runId}</Navigate>
      </a>
      <Icon cssClass="inline-block" height="20" width="20">
        <path d="M9 5l7 7-7 7" />
      </Icon>
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
