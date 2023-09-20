<script>
  import { onMount } from "svelte";
  import { Navigate } from "svelte-router-spa";
  import Breadcrumbs from "../components/misccomponents/Breadcrumbs.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import Icon from "../components/misccomponents/Icon.svelte";
  import Tabs from "../components/misccomponents/Tabs.svelte";
  import Toastr from "../components/misccomponents/Toastr.svelte";
  import slug from "slug";
  import {
    getBuildDetails,
    userSession$,
  } from "../stores";
  import LighthouseDetailsCard from "../components/lighthousecomponents/LighthouseDetailsCard.svelte";
  import UpdatePerfThreshold from "../components/lighthousecomponents/UpdatePerfThreshold.svelte";
  import { CONSTS } from "../utils/utils";
  import CardSummary from "../components/summaryitemcomponents/CardSummary.svelte";
  import { renderReport } from 'lighthouse-viewer';

  export let currentRoute;

  let loading;

  let promise = getBuildDetails(currentRoute.namedParams.id);
  let runId;
  let userNotLoginToast;
  let perfThresholdShown;
  let scanUrl;
  let loadingPerfSettings;
  let lastBuild;
  let threshold;

  const download = () => {
    window.location.href = `${CONSTS.BlobURL}/lhr/${currentRoute.namedParams.id}.json`;
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
        `${CONSTS.API}/api/config/${user.apiKey}/perfthreshold/${slug(scanUrl)}`
      );
      const result = await res.json();
      threshold = result || {};
    } catch (error) {
      console.error("error getting threshold", error);
      threshold = {};
    } finally {
      loadingPerfSettings = false;
    }
  };

  onMount(() => {
    if (currentRoute && currentRoute.namedParams.id) {
      loading = true;
      runId = currentRoute.namedParams.id;
      fetch(`${CONSTS.BlobURL}/lhr/${currentRoute.namedParams.id}.json`)
        .then((x) => x.json())
        .then((json) => {
          loading = false;
          const svelteAppElement = document.getElementById('report');
          if (svelteAppElement) {
            const reportHtml = renderReport(json, {
              disableDarkMode: true,
            });
            svelteAppElement.appendChild(reportHtml);
          }
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
          displayMode="Lighthouse Audit" />
        <br />

        <CardSummary 
          value={data.summary}
          isLighthouseAudit={true}
          on:perfThreshold={() => showPerfThreshold(data.summary, $userSession$)}
        />

        <LighthouseDetailsCard build={data ? data : {}} />

        <Tabs build={data ? data : {}} displayMode="lighthouse" />
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
          class="bg-gray-300 hover:bg-gray-400 textdark font-bold py-1 px-1
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
