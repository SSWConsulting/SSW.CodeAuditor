<script>
  import { Navigate } from "svelte-router-spa";
  import ArtilleryDetailTable from "../components/artillerycomponents/ArtilleryDetailTable.svelte";
  import Breadcrumbs from "../components/misccomponents/Breadcrumbs.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import Tabs from "../components/misccomponents/Tabs.svelte";
  import Icon from "../components/misccomponents/Icon.svelte";
  import Toastr from "../components/misccomponents/Toastr.svelte";
  import slug from "slug";
  import ArtilleryChart from "../components/artillerycomponents/ArtilleryChart.svelte";
  import {
    getBuildDetails,
    userSession$,
  } from "../stores";
  import { CONSTS } from "../utils/utils";
  import CardSummary from "../components/summaryitemcomponents/CardSummary.svelte";
  import UpdateArtilleryThreshold from "../components/artillerycomponents/UpdateArtilleryThreshold.svelte";
  import ArtilleryDetailsCard from "../components/artillerycomponents/ArtilleryDetailsCard.svelte";

  export let currentRoute;

  let loading;

  let promise = getBuildDetails(currentRoute.namedParams.id);
  let userNotLoginToast;
  let artilleryThresholdShown;
  let scanUrl;
  let loadingArtillerySettings;
  let lastBuild;
  let threshold;

  const download = () => {
    window.location.href = `${CONSTS.BlobURL}/atr/${currentRoute.namedParams.run}.json`;
  };

  const showArtilleryThreshold = async (summary, user) => {
    if (!user) {
      userNotLoginToast = true;
      return;
    }
    scanUrl = summary.url;
    lastBuild = summary;
    artilleryThresholdShown = true;
    loadingArtillerySettings = true;
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
      loadingArtillerySettings = false;
    }
  };

  let atrFull = [];
  const getAtrFull = async (path) => {
    await fetch(`${CONSTS.BlobURL}/atr/${path}.json`)
      .then((x) => x.json())
      .then((res) => {
        res.intermediate.forEach((i) => {
          atrFull.push({
            fullTimestamp: i.timestamp,
            fullLatencyMedian: i.latency.median,
            fullLatencyP95: i.latency.p95,
            fullLatencyP99: i.latency.p99,
          });
        });
      });
    return atrFull;
  };

  let getAtrData = getAtrFull(currentRoute.namedParams.id);
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
          displayMode="Artillery Load Test" />
        <br />

        <CardSummary value={data.summary} />

        <ArtilleryDetailsCard
          build={data ? data : {}}
          on:artilleryThreshold={() => showArtilleryThreshold(data.summary, $userSession$)} />

        <Tabs build={data ? data : {}} displayMode="artillery" />

        {#if data.summary.latencyP95 !== undefined}
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

          <div class="grid grid-rows-1">
            <div class="h-5" />
          </div>

          {#await getAtrData}
            <LoadingFlat />
          {:then atrFull}
            <ArtilleryChart value={atrFull} />
          {/await}

          <ArtilleryDetailTable value={data} />
        {:else}
          <div class="mb-6 text-center text-xl py-8">
            <Icon cssClass="text-yellow-800 inline-block">
              <path
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
              21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </Icon>
            Artillery Load Test was not executed
            <Icon cssClass="text-yellow-800 inline-block">
              <path
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13
              21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </Icon>
          </div>
        {/if}
      {:catch error}
        <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
      {/await}
    {/if}
  </div>
</div>

<UpdateArtilleryThreshold
  url={scanUrl}
  loading={loadingArtillerySettings}
  bind:show={artilleryThresholdShown}
  {lastBuild}
  {threshold}
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
