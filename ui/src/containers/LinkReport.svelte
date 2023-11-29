<script>
  import {
    getBuildDetails,
    userSession$,
    getIgnoreList,
    getLatestBuildDetails
  } from "../stores";
  import DetailsTable from "../components/linkauditorcomponents/DetailsTable.svelte";
  import Toastr from "../components/misccomponents/Toastr.svelte";
  import { mkConfig, generateCsv, download } from "export-to-csv";
  import { Navigate } from "svelte-router-spa";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import UpdateIgnoreUrl from "../components/misccomponents/UpdateIgnoreUrl.svelte";
  import BuildDetailsSlot from "../components/detailslotcomponents/BuildDetailsSlot.svelte";

  export let currentRoute;

  let promise;
  let userNotLoginToast;
  let ignoreUrlShown;
  let urlToIgnore;
  let scanUrl;

  if (currentRoute.namedParams.id) {
    promise = new Promise(async (resolve) => {
      const buildDetails = await getBuildDetails(currentRoute.namedParams.id);
      resolve({ buildDetails });
    });
  } else {
    promise = new Promise(async (resolve) => {
      const buildDetails = await getLatestBuildDetails(currentRoute.namedParams.api, currentRoute.namedParams.url);
      resolve({ buildDetails });
    });
  }

  const onDownload = data => {
    const csvConfig = mkConfig({
      showLabels: true,
      showTitle: true,
      title: `URL:,${data.summary.url},Duration:,${data.summary.scanDuration},URL Scanned:,${data.summary.totalScanned}`,
      useKeysAsHeaders: true
    });

    const csv = generateCsv(csvConfig)(data.brokenLinks.map(x => {
        delete x["etag"];
        delete x["buildId"];
        delete x["partitionKey"];
        delete x["rowKey"];
        delete x["timestamp"];
        return x;
      })
    );

    download(csvConfig)(csv);
  };

  const showIgnore = (mainUrl, url, user) => {
    if (!user) {
      userNotLoginToast = true;
      return;
    }
    scanUrl = mainUrl;
    urlToIgnore = url.detail;
    ignoreUrlShown = true;
  };

  $: if ($userSession$) {
    getIgnoreList($userSession$);
  }
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">

    {#await promise}
      <LoadingFlat />
    {:then data}

    <BuildDetailsSlot
      data={data.buildDetails}
      componentType="Links"
    >
      <DetailsTable
        on:download={() => onDownload(data.buildDetails)}
        on:ignore={url => showIgnore(data.buildDetails.summary.url, url, $userSession$)}
        builds={data.buildDetails ? data.buildDetails.brokenLinks : []}
        {currentRoute}
        unscannableLinks={[]}
        scanUrl={data.buildDetails.summary.url}
      />
    </BuildDetailsSlot>
    {:catch error}
      <p class="text-red-600 mx-auto text-2xl py-8">{error.message}</p>
    {/await}
  </div>
</div>

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

<UpdateIgnoreUrl
  url={urlToIgnore}
  {scanUrl}
  bind:show={ignoreUrlShown}
  user={$userSession$} />
