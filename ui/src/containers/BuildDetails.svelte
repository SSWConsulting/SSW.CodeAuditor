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
  let rawData;
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
        builds={data ? data.brokenLinks : []}
        {currentRoute}
        summary={data ? data.summary[0] : {}} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
