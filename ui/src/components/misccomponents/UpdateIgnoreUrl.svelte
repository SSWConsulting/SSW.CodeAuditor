<script>
  import { ignoredUrls$ } from "../../stores";
  import SelectField from "./SelectField.svelte";
  import Toastr from "./Toastr.svelte";
  import TextField from "./TextField.svelte";
  import { Navigate } from "svelte-router-spa";
  import { CONSTS } from "../../utils/utils";
  import Modal from "./Modal.svelte";

  export let url = 'https://';
  export let scanUrl;
  export let show;
  export let user;
  export let duration;
  export let editing = false;

  let ignoredUrls = [];

  let ignoreOn = "all";
  let ignoreDuration = 3;
  let loading;
  let addedSuccessToast;

  const ignoreDurations = [
    { value: 3, label: "3 days" },
    { value: 7, label: "1 week" },
    { value: 14, label: "2 weeks" },
    { value: 30, label: "1 month" },
    { value: -1, label: "Permanently" }
  ];
  const dismiss = () => (show = false);
  const updateIgnore = async () => {
    loading = true;
    const res = await fetch(`${CONSTS.API}/api/config/${user.apiKey}/ignore`, {
      method: "POST",
      body: JSON.stringify({
        urlToIgnore: url,
        ignoreOn,
        ignoreDuration
      }),
      headers: { "Content-Type": "application/json" }
    });

    ignoredUrls = await res.json();

    if (res.ok) {
      ignoredUrls$.set(ignoredUrls);
      loading = false;
      show = false;
      addedSuccessToast = true;
    } else {
      throw new Error("Failed to load");
    }
  };

  $: if (show) {
    if (scanUrl === "all") {
      scanUrl = null;
    }

    ignoreOn = editing && scanUrl ? scanUrl : "all";
    ignoreDuration = duration ||  3;
  }
</script>

<style>
  input[type="radio"] + label span {
    transition: background 0.2s, transform 0.2s;
  }

  input[type="radio"] + label:not(.disabled) span:hover,
  input[type="radio"] + label:hover:not(.disabled) span {
    transform: scale(1.2);
    cursor: pointer;
  }

  input[type="radio"] + label:hover:not(.disabled) {
    cursor: pointer;
  }

  input[type="radio"]:checked + label span {
    background-color: black;
    box-shadow: 0px 0px 0px 2px white inset;
  }

  input[type="radio"]:checked + label.disabled span {
    background-color: #ccc;
    border-color: #ccc;
  }

  input[type="radio"] + label.disabled span {
    background-color: white;
    border-color: #ccc;
  }

  input[type="radio"]:checked + label {
    color: #414141;
  }

  input[type="radio"] + label.disabled {
    color: #ccc;
  }
</style>

<Modal
  bind:show
  bind:loading
  header="Ignore the following URL"
  mainAction="Save"
  on:action={updateIgnore}
  on:dismiss={dismiss}>
  <div>
    <div class="text-md text-grey-400 mb-4">
      Ignoring a URL here will prevent CodeAuditor from scanning it for future scans. A URL can be ignored
      for a specified period of time, for either all sites or just the current site.
    </div>
    <TextField bind:value={url} disabled={editing} placeholder="" label="URL" type="text" />
    <div class="text-sm text-grey-400 mb-2">
      You can use glob matching, e.g. https://twitter.com/** will match with
      https://twitter.com/users/john or https://twitter.com/login
    </div>
    <div class="text-sm text-grey-400 mb-4">
      To see more supported Glob patterns, check out 
      <a class="link hover:text-red-600" href="https://github.com/SSWConsulting/SSW.CodeAuditor/wiki/SSW-CodeAuditor-Knowledge-Base-(KB)#supported-glob-patterns-when-adding-ignored-urls">CodeAuditor KB</a>
    </div>
    <label for="radio1" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">For</label>
    <ul class="mb-4">
      <li class="pb-3">
        <div class="flex items-center ml-2 mr-4">
          <input
            id="radio1"
            type="radio"
            class="hidden"
            value={'all'}
            bind:group={ignoreOn}
            disabled={editing}
          />

          <label for="radio1" class:disabled={editing} class="flex items-center">
            <span
              class="w-5 h-5 inline-block mr-2 rounded-full border-black
              border-solid border shrink-0" />
            All new builds
          </label>
        </div>
      </li>
      {#if scanUrl}
        <li>
          <div class="flex items-center ml-2 mr-4">
            <input
              type="radio"
              class="hidden"
              id="radio2"
              bind:group={ignoreOn}
              value={url}
              disabled={editing}
            />
            <label for="radio2" class:disabled={editing} class="flex items-center">
              <span
                class="w-5 h-5 inline-block mr-2 rounded-full border-black
                border-solid border shrink-0" />
              Only when {scanUrl} is scanned
            </label>
          </div>
        </li>
      {/if}
    </ul>
    <SelectField
      bind:value={ignoreDuration}
      label="Ignore Duration:"
      allowNull={false}
      options={ignoreDurations} />
  </div>
</Modal>

<Toastr bind:show={addedSuccessToast}>
  <p class="font-bold">Added to ignored list!</p>
  <p class="text-sm">
    You currently have {ignoredUrls.length} ignored URLs.
    <span
      class="inline-block align-baseline font-bold text-sm text-blue
      hover:text-blue-darker">
      <Navigate to="/settings">View</Navigate>
    </span>
  </p>
</Toastr>
