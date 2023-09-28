<script>
  import Toastr from "../misccomponents/Toastr.svelte";
  import { CONSTS, getLoadThresholdResult } from "../../utils/utils.js";
  import Modal from "../misccomponents/Modal.svelte";
  import LoadingFlat from "../misccomponents/LoadingFlat.svelte";

  export let url;
  export let threshold = {};
  export let show;
  export let loading;
  export let lastBuild;
  export let user;

  let saving;
  let addedSuccess;

  const dismiss = () => (show = false);
  const clearAll = () =>
    (threshold = {
      latencyMedian: 0,
      latencyP95: 0,
      latencyP99: 0,
      errors: 0,
    });
  const useLastBuild = () => (threshold = getLoadThresholdResult(lastBuild));

  const updateIgnore = async () => {
    saving = true;
    const res = await fetch(
      `${CONSTS.API}/api/config/${user.apiKey}/loadthreshold`,
      {
        method: "PUT",
        body: JSON.stringify({
          url,
          ...threshold,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      saving = false;
      show = false;
      addedSuccess = true;
    } else {
      throw new Error("Failed to load");
    }
  };
</script>

<Modal
  bind:show
  bind:loading={saving}
  header="Fail the build when:"
  mainAction="Save"
  on:action={updateIgnore}
  on:dismiss={dismiss}>
  {#if loading}
    <LoadingFlat />
  {:else}
    <!-- else content here -->
    <div class="ml-5">
      <label
        for="median-latency"
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-3">
        Median latency (ms) is &lt {threshold.latencyMedian}
      </label>
      <input
        id="median-latency"
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:ring"
        type="number"
        bind:value={threshold.latencyMedian}
        required={false} />

      <label
        for="p95-latency"
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-3">
        P95 latency (ms) is &lt {threshold.latencyP95}
      </label>
      <input
        id="p95-latency"
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:ring"
        type="number"
        bind:value={threshold.latencyP95}
        required={false} />

      <label
        for="p99-latency"
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-3">
        P99 latency (ms) is &lt {threshold.latencyP99}
      </label>
      <input
        id="p99-latency"
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:ring"
        type="number"
        bind:value={threshold.latencyP99}
        required={false} />

        <label
          for="errors-count"
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-3">
          Number of errors &lt {threshold.errors}
      </label>
      <input
        id="errors-count"
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:ring"
        type="number"
        bind:value={threshold.errors}
        required={false} />

      <div class="italic text-center pb-3">0 = ignore criteria</div>
      <div class="text-center">
        <button
          on:click={clearAll}
          type="button"
          class="bg-grey-100 hover:bg-blue-500 text-blue-800 font-semibold ml-1
          hover:text-white py-2 px-4 border border-blue-500
          hover:border-transparent rounded">
          Remove Threshold 
        </button>
        <button
          on:click={useLastBuild}
          type="button"
          class="bg-grey-100 hover:bg-blue-500 text-blue-800 font-semibold ml-1
          hover:text-white py-2 px-4 border border-blue-500
          hover:border-transparent rounded">
          Use This Build Stats
        </button>
      </div>

    </div>
  {/if}
</Modal>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">Artillery Load threshold updated for</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>
