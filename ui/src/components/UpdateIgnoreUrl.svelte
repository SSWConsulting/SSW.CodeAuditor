<script>
  import { userApi, userSession$, ignoredUrls$ } from "../stores";
  import SelectField from "../components/SelectField.svelte";
  import Toastr from "../components/Toastr.svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import { CONSTS } from "../utils/utils.js";
  import Modal from "../components/Modal.svelte";

  export let url;
  export let scanUrl;
  export let show;
  export let user;

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
</script>

<style>
  input[type="radio"] + label span {
    transition: background 0.2s, transform 0.2s;
  }

  input[type="radio"] + label span:hover,
  input[type="radio"] + label:hover span {
    transform: scale(1.2);
  }

  input[type="radio"]:checked + label span {
    background-color: #3490dc;
    box-shadow: 0px 0px 0px 2px white inset;
  }

  input[type="radio"]:checked + label {
    color: #3490dc;
  }
</style>

<Modal
  bind:show
  bind:loading
  header="Ignore the following URL"
  mainAction="Save"
  on:action={updateIgnore}
  on:dismiss={dismiss}>
  <a
    class="inline-block hover:text-blue-800 pb-5 pl-5 text-lg"
    target="_blank"
    href={url}>
    {url}
  </a>

  <ul class="ml-5">
    <li class="pb-3">
      <div class="flex items-center mr-4 mb-4">
        <input
          id="radio1"
          type="radio"
          class="hidden"
          value={'all'}
          bind:group={ignoreOn} />

        <label for="radio1" class="flex items-center cursor-pointer">
          <span
            class="w-5 h-5 inline-block mr-2 rounded-full border border-grey
            flex-no-shrink" />
          For all new builds
        </label>
      </div>
    </li>
    <li>
      <div class="flex items-center mr-4 mb-4">
        <input
          type="radio"
          class="hidden"
          id="radio2"
          bind:group={ignoreOn}
          value={url} />
        <label for="radio2" class="flex items-center cursor-pointer">
          <span
            class="w-5 h-5 inline-block mr-2 rounded-full border border-grey
            flex-no-shrink" />
          Only when {scanUrl} is scanned
        </label>
      </div>
    </li>
    <SelectField
      bind:value={ignoreDuration}
      label="For:"
      allowNull={false}
      options={ignoreDurations} />
  </ul>
</Modal>

<Toastr bind:show={addedSuccessToast}>
  <p class="font-bold">Added to ignored list!</p>
  <p class="text-sm">
    You currently have {ignoredUrls.length} ignored URLs.
    <span
      class="inline-block align-baseline font-bold text-sm text-blue
      hover:text-blue-darker">
      <Navigate to="/home/settings">View</Navigate>
    </span>
  </p>
</Toastr>
