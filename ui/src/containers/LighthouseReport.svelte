<script>
  import { onMount, onDestroy } from "svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import Breadcrumbs from "../components/Breadcrumbs.svelte";
  import LoadingFlat from "../components/LoadingFlat.svelte";
  import Icon from "../components/Icon.svelte";
  import Tabs from "../components/Tabs.svelte";
  import Toastr from "../components/Toastr.svelte";
  import slug from "slug";
  import {
    getBuildDetails,
    userApi,
    userSession$,
    getIgnoreList
  } from "../stores";
  import LighthouseDetailsCard from "../components/LighthouseDetailsCard.svelte";
  import UpdatePerfThreshold from "../components/UpdatePerfThreshold.svelte";
  import { printTimeDiff, CONSTS } from "../utils/utils";
  import { format } from "date-fns";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import CardSummary from "../components/CardSummary.svelte";

  export let currentRoute;

  let loading;

  let promise = getBuildDetails(currentRoute.namedParams.run);
  let runId;
  let userNotLoginToast;
  let perfThresholdShown;
  let scanUrl;
  let loadingPerfSettings;
  let lastBuild;
  let threshold;

  const download = () => {
    window.location.href = `${CONSTS.BlobURL}/lhr/${currentRoute.namedParams.run}.json`;
  };

  const showPerfThreshold = async (summary, user) => {
    if (!user) {
      userNotLoginToast = true;
      return;
    }
    scanUrl = summary.url;
    lastBuild = summary;
    perfThresholdShown = true;
    loadingPerfSettings = true;
    try {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/loadthreshold/${slug(scanUrl)}`
      );
      const result = await res.json();
      threshold = result || blank;
    } catch (error) {
      console.error("error getting threshold", error);
      threshold = blank;
    } finally {
      loadingPerfSettings = false;
    }
  };

  onMount(() => {
    if (currentRoute && currentRoute.namedParams.run) {
      loading = true;
      runId = currentRoute.namedParams.run;
      fetch(`${CONSTS.BlobURL}/lhr/${currentRoute.namedParams.run}.json`)
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

    {#if loading}
      <LoadingFlat />
    {:else}
      {#await promise}
        <LoadingFlat />
      {:then data}
        <Breadcrumbs
          build={data ? data.summary : {}}
          runId={currentRoute.namedParams.id}
          displayMode="Lighthouse Audit" />
        <br />

        <CardSummary value={data.summary} />

        <LighthouseDetailsCard
          build={data ? data.summary : {}}
          on:perfThreshold={() => showPerfThreshold(data.summary, $userSession$)} />

        <Tabs build={data ? data.summary : {}} displayMode="lighthouse" />

      {:catch error}
        <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
      {/await}
    {/if}
    <!-- this is where the lighthouse report will go -->
    <div class="my-4">
      <div class="float-right">
        <button
          on:click={download}
          title="Download JSON"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-1
          rounded-lg inline-flex items-center">
          <Icon cssClass="">
            <path
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </Icon>
        </button>
      </div>
    </div>
    <main id="report" />
  </div>
</div>

<UpdatePerfThreshold
  url={scanUrl}
  loading={loadingPerfSettings}
  {lastBuild}
  {threshold}
  bind:show={perfThresholdShown}
  user={$userSession$} />

<Toastr bind:show={userNotLoginToast} timeout={10000} mode="warn">
  <p>Sign in to unlock this feature!</p>
  <p class="text-sm pt-2">
    <span
      class="inline-block align-baseline font-bold text-sm text-blue
      hover:text-blue-darker">
      <Navigate to="/login">Sign in</Navigate>
    </span>
  </p>
</Toastr>
