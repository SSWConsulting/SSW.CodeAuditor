<script>
  import LighthouseSummary from "../summaryitemcomponents/LighthouseSummary.svelte";
  import Toastr from "../misccomponents/Toastr.svelte";
  import TextField from "../misccomponents/TextField.svelte";
  import { CONSTS, getPerfScore } from "../../utils/utils.js";
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
      performanceScore: 0,
      pwaScore: 0,
      seoScore: 0,
      accessibilityScore: 0,
      bestPracticesScore: 0,
      average: 0,
    });
  const useLastBuild = () => (threshold = getPerfScore(lastBuild));

  const updateIgnore = async () => {
    saving = true;
    const res = await fetch(
      `${CONSTS.API}/api/config/${user.apiKey}/perfthreshold`,
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

      <TextField
        bind:value={threshold.average}
        placeholder=""
        required={false}
        label={'Average Score is < ' + threshold.average}
        type="range"
        min="0"
        max="100" />
      <TextField
        bind:value={threshold.performanceScore}
        placeholder=""
        required={false}
        label={'Performance Score < ' + threshold.performanceScore}
        type="range"
        min="0"
        max="100" />
      <TextField
        bind:value={threshold.accessibilityScore}
        required={false}
        placeholder=""
        label={'Accessibility Score < ' + threshold.accessibilityScore}
        type="range"
        min="0"
        max="100" />
      <TextField
        bind:value={threshold.seoScore}
        placeholder=""
        required={false}
        label={'SEO Score < ' + threshold.seoScore}
        type="range"
        min="0"
        max="100" />
      <TextField
        bind:value={threshold.pwaScore}
        required={false}
        placeholder=""
        label={'PWA Score < ' + threshold.pwaScore}
        type="range"
        min="0"
        max="100" />
      <TextField
        bind:value={threshold.bestPracticesScore}
        placeholder=""
        required={false}
        label={'Best Practice Score < ' + threshold.bestPracticesScore}
        type="range"
        min="0"
        max="100" />
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
      <LighthouseSummary value={lastBuild} showLabel={false} />
    </div>
  {/if}
</Modal>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">Performance threshold updated for</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>
