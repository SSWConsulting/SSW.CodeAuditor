<script>
  import {
    getBuildDetails,
    userSession$,
    getIgnoreList
  } from "../stores";
  import Tabs from "../components/miscComponents/Tabs.svelte";
  import Breadcrumbs from "../components/miscComponents/Breadcrumbs.svelte";
  import DetailsTable from "../components/linkauditorComponents/DetailsTable.svelte";
  import Toastr from "../components/miscComponents/Toastr.svelte";
  import BuildDetailsCard from "../components/detailCard/BuildDetailsCard.svelte";
  import { ExportToCsv } from "export-to-csv";
  import { Navigate } from "svelte-router-spa";
  import LoadingFlat from "../components/miscComponents/LoadingFlat.svelte";
  import UpdateIgnoreUrl from "../components/miscComponents/UpdateIgnoreUrl.svelte";
  import CardSummary from "../components/summaryItem/CardSummary.svelte";

  export let currentRoute;

  let promise = getBuildDetails(currentRoute.namedParams.id);
  let userNotLoginToast;
  let ignoreUrlShown;
  let urlToIgnore;
  let scanUrl;

  const onDownload = data => {
    const csvExporter = new ExportToCsv({
      showLabels: true,
      showTitle: true,
      title: `URL:,${data.summary.url},Duration:,${data.summary.scanDuration},URL Scanned:,${data.summary.totalScanned}`,
      useKeysAsHeaders: true
    });

    csvExporter.generateCsv(
      data.brokenLinks.map(x => {
        delete x["odata.etag"];
        delete x["PartitionKey"];
        delete x["RowKey"];
        delete x["Timestamp"];
        return x;
      })
    );
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

  userSession$.subscribe(x => {
    if (x) {
      getIgnoreList(x);
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">

    {#await promise}
      <LoadingFlat />
    {:then data}

    <Breadcrumbs
      build={data ? data.summary : {}}
      runId={currentRoute.namedParams.id}
      displayMode="Links" />
    <br>
      
      <CardSummary value={data.summary} />

      <BuildDetailsCard build={data ? data.summary : {}} />
      
      <Tabs build={data ? data.summary : {}} displayMode="url" />

      <DetailsTable
        on:download={() => onDownload(data)}
        on:ignore={url => showIgnore(data.summary.url, url, $userSession$)}
        builds={data ? data.brokenLinks : []}
        {currentRoute} />
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
