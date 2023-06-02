<script>
  import Modal from "./Modal.svelte";
  import LoadingFlat from "./LoadingFlat.svelte";
  import TextField from "./TextField.svelte";
  import { CONSTS, validateEmail } from "../../utils/utils";

  export let show;
  export let url;
  export let userApiKey;
  export let sharedEmailAddresses = [];

  let isLoading;
  let emailAddress = "";
  let type = "text";

  const dismiss = () => (show = false);

  const handleInput = (e) => {
    emailAddress = validateEmail(e.target.value) ? e.target.value : null;
  };

  const removeAlertEmail = async (e) => {
    isLoading = true;
    const res = await fetch(`${CONSTS.API}/api/deletealertemailaddress`, {
      method: "DELETE",
      body: JSON.stringify({
        api: e.partitionKey,
        rowkey: e.rowKey,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      isLoading = false;
      show = false;
    } else {
      throw new Error("Failed to load");
    }
  };

  const updateCustomHtmlRules = async () => {
    isLoading = true;
    const res = await fetch(
      `${CONSTS.API}/api/${userApiKey}/addalertemailaddresses`,
      {
        method: "PUT",
        body: JSON.stringify({
          url,
          emailAddress,
          authorToken: userApiKey,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      isLoading = false;
      show = false;
    } else {
      throw new Error("Failed to load");
    }
  };
</script>

<div
  class:opacity-0={!show}
  class:pointer-events-none={!show}
  class="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0
  flex items-center justify-center"
>
  <div
    class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
    on:click={dismiss}
  />

  <div
    class={`modal-container bg-white w-11/12 md:max-w-lg mx-auto rounded shadow-lg z-50 overflow-y-auto`}
  >
    <!-- Add margin if you want to see some of the overlay behind the modal-->
    <div class="modal-content py-4 text-left px-6">
      <!--Title-->
      <div class="flex justify-between items-center pb-3">
        <p class="text-2xl font-bold">Send email alerts for future scans:</p>
      </div>
      {#if isLoading}
        <LoadingFlat />
      {:else}
        <!-- else content here -->
        <div class="modal-body py-5 overflow-y-auto">
          <div class="grid grid-cols-3 gap-x-4">
            <div class="col-span-2">
              <input
                class="appearance-none block w-full text-gray-700 border border-gray-300
            rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white
            focus:border-gray-500"
                {type}
                value={emailAddress}
                class:border-red-300={!emailAddress}
                class:focus:border-red-500={!emailAddress}
                on:input={handleInput}
                placeholder="Add email address"
              />
            </div>
            <div>
              <button
                type="button"
                disabled={!emailAddress}
                class="bg-blue-500 hover:bg-blue-800 text-white font-semibold py-2 px-4 border hover:border-transparent rounded"
                on:click={updateCustomHtmlRules}>Add</button
              >
            </div>
          </div>
          <div class="font-sans font-bold mt-3">
            Currently alerted Email Addresses:
          </div>
          {#each sharedEmailAddresses as item}
            <li>
              {item.emailAddress}
              <button
                type="button"
                on:click={removeAlertEmail(item)}
                class="bg-red-600 hover:bg-red-800 text-white px-2 border hover:border-transparent rounded"
              >
                <i class="fas fa-minus" />
              </button>
            </li>
          {/each}
        </div>
      {/if}
      <!--Footer-->
      <div class="flex justify-end pt-2 mb-3">
        <button
          on:click={dismiss}
          type="button"
          class="bgdark hover:bg-grey-800 font-semibold ml-1 text-white
        hover:text-white py-2 px-4 border hover:border-transparent rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
