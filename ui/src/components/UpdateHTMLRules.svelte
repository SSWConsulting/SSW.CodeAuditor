<script>
  import Toastr from "../components/Toastr.svelte";
  import { CONSTS, getLoadThresholdResult } from "../utils/utils.js";
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

  let group = 1;
	let selection = [];

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
  header="Select HTML Rules:"
  mainAction="Save"
  on:action={updateIgnore}
  on:dismiss={dismiss}>
  {#if loading}
    <LoadingFlat />
  {:else}
    <!-- else content here -->
    <h3 class="font-bold">HTML Hint Rules: </h3>
    <label><input type="checkbox" bind:group={selection} value={1} /> alt-require</label>
    <label><input type="checkbox" bind:group={selection} value={2} /> attr-lowercase</label>
    <label><input type="checkbox" bind:group={selection} value={3} /> src-not-empty</label>
    <label><input type="checkbox" bind:group={selection} value={4} /> tagname-lowercase</label>
    <label><input type="checkbox" bind:group={selection} value={5} /> tag-pair</label>
    <label><input type="checkbox" bind:group={selection} value={6} /> inline-style-disabled</label>
    <br />
    <h3 class="font-bold">Custom Rules: </h3>
    <label><input type="checkbox" bind:group={selection} value={1} /> language-code-block</label>
    <label><input type="checkbox" bind:group={selection} value={2} /> ssw-rocks</label>
    <br/>
    <a class="underline text-blue-700">How to add your own Custom Rule</a>

  {/if}
</Modal>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">Artillery Load threshold updated for</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>
