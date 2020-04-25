<script>
  import { userApi, userSession$ } from "../stores";
  import { onMount } from "svelte";
  import marked from "marked";
  import firebase from "firebase/app";
  import DetailsTable from "../components/DetailsTable.svelte";
  import BuildDetailsCard from "../components/BuildDetailsCard.svelte";
  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";
  import { ExportToCsv } from "export-to-csv";

  export let currentRoute;
  let promise;
  let showToastr;
  let rawData;
  let ignoredUrls = [];

  const onDownload = () => {
    debugger;
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: `URL:,${rawData.summary.url},Duration:,${rawData.summary.scanDuration},URL Scanned:,${rawData.summary.totalScanned}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(
      rawData.brokenLinks.map(x => {
        delete x["odata.etag"];
        delete x["PartitionKey"];
        delete x["RowKey"];
        delete x["Timestamp"];
        return x;
      })
    );
  };
  async function getBuildDetails() {
    const res = await fetch(
      `${CONSTS.API}/api/run/${currentRoute.namedParams.id}`
    );
    const result = await res.json();

    if (res.ok) {
      rawData = { summary: result.summary[0], brokenLinks: result.brokenLinks };
      return result;
    } else {
      throw new Error("Failed to load");
    }
  }

  const ignore = async (event, user) => {
    console.log(event.detail, user);
    const res = await fetch(`${CONSTS.API}/api/config/${user.apiKey}/ignore`, {
      method: "POST",
      body: JSON.stringify({
        ...event.detail
      }),
      headers: { "Content-Type": "application/json" }
    });
    const result = await res.json();

    if (res.ok) {
      ignoredUrls = result;
      showToastr = true;
      setTimeout(() => {
        showToastr = false;
      }, 7000);
      return result;
    } else {
      throw new Error("Failed to load");
    }
  };
  onMount(() => (promise = getBuildDetails()));
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#await promise}
      <p class="pb-6 mb-6">Downloading report, please wait...</p>
    {:then data}
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
          href="/home">
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
          href="/build/{currentRoute.namedParams.id}">
          {currentRoute.namedParams.id}
        </a>
      </p>
      <BuildDetailsCard
        build={data ? data.summary[0] : {}}
        on:download={onDownload} />
      <DetailsTable
        on:ignore={event => ignore(event, $userSession$)}
        builds={data ? data.brokenLinks : []}
        {currentRoute}
        summary={data ? data.summary[0] : {}} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
{#if showToastr}
  <div
    in:fly={{ y: 100, duration: 400 }}
    out:fade={{ y: -100, duration: 250 }}
    class="mx-auto z-auto mt-6 mr-12 fixed top-0 right-0 bg-teal-100 border-t-4 border-teal-500
    rounded-b text-teal-900 px-4 py-3 shadow-md toast"
    role="alert">
    <div class="flex">
      <div class="py-1">
        <svg
          class="fill-current h-6 w-6 text-teal-500 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20">
          <path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93
            17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9
            11V9h2v6H9v-4zm0-6h2v2H9V5z" />
        </svg>
      </div>
      <div>
        <p class="font-bold">Added to ignored list!</p>
        <p class="text-sm">
          You currently have {ignoredUrls.length} ignored URLs.
          <a
            class="inline-block align-baseline font-bold text-sm text-blue
            hover:text-blue-darker"
            href="/settings">
            View
          </a>
        </p>
      </div>
    </div>
  </div>
  <!-- content here -->
{/if}
