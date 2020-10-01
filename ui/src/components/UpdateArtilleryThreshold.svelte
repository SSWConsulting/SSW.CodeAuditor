<script>
  import { userApi, userSession$, ignoredUrls$ } from "../stores";
  import SelectField from "../components/SelectField.svelte";
  import ArtillerySummary from "./ArtillerySummary.svelte";
  import Toastr from "../components/Toastr.svelte";
  import TextField from "../components/TextField.svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { CONSTS, getPerfScore } from "../utils/utils.js";
  import Modal from "../components/Modal.svelte";
  import LoadingFlat from "./LoadingFlat.svelte";

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
      performanceScore: 0,
      accessibilityScore: 0,
      average: 0,
    });
  const useLastBuild = () => (threshold = getPerfScore(lastBuild));

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
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold
        mb-2">
        Latency Min (ms)
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={threshold.average}
        required={false} />

      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold
        mb-2">
        Latency Max (ms)
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={threshold.average}
        required={false} />

      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold
        mb-2">
        Latency Median (ms)
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={threshold.average}
        required={false} />

      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold
        mb-2">
        Latency P95 (ms)
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={threshold.average}
        required={false} />

      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold
        mb-2">
        Latency P99 (ms)
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={threshold.average}
        required={false} />

        <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold
        mb-2">
        Number of errors
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3
        text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={threshold.average}
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
    <div class="pt-3">
      <ArtillerySummary value={lastBuild} />
    </div>
  {/if}
</Modal>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">Performance threshold updated for</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>
