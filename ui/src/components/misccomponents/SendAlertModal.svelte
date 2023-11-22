<script>
  import LoadingFlat from "./LoadingFlat.svelte";
  import { CONSTS, validateEmail } from "../../utils/utils";

  export let show;
  export let url;
  export let userApiKey;
  export let sharedEmailAddresses = [];

  let isLoading;
  let emailAddress = "";
  let showErrorPrompt = false;

  const dismiss = () => (show = false);

  const handleInput = (e) => {
    if (e.key === "Enter") {
      updateEmailAddress();
    } else {
      showErrorPrompt = false;
    }
  };

  const reloadSharedEmailList = async () => {
    const res = await fetch(`${CONSTS.API}/api/getalertemailaddresses/${userApiKey}`, {
        method: "POST",
        body: JSON.stringify({url}),
        headers: { "Content-Type": "application/json" },
      })
    sharedEmailAddresses = await res.json();
  }

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
      reloadSharedEmailList();
    } else {
      throw new Error("Failed to load");
    }
  };

  const updateEmailAddress = async () => {
    if (emailAddress && validateEmail(emailAddress)) {
      showErrorPrompt = false;
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
        emailAddress = "";
        reloadSharedEmailList();
      } else {
        throw new Error("Failed to load");
      }
    } else {
      showErrorPrompt = true;
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
    on:keydown={undefined}
  />

  <div
    class={`modal-container bg-white md:max-w-lg mx-auto rounded shadow-lg z-50 overflow-y-auto`}
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
                class="appearance-none block w-full text-gray-700 border border-red-700
                rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white
                focus:border-red-800"
                type="text"
                bind:value={emailAddress}
                on:keydown={handleInput}
                class:border-red-300={!emailAddress}
                class:focus:border-red-500={!emailAddress}
                placeholder="Email address"
              />
            </div>
            <div>
              <button
                type="button"
                class="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 border hover:border-transparent rounded"
                on:click={updateEmailAddress}>Add</button
              >
            </div>
          </div>
          <div class="{showErrorPrompt ? 'visible' : 'invisible'}">
            <span class="text-red-700 font-sans">Invalid email input</span>
          </div>
          {#if sharedEmailAddresses.length > 0}
            <div class="font-sans font-bold mt-5">
              Currently receiving alerts:
            </div>
            {#each sharedEmailAddresses as item}
              <li 
                class="cursor-pointer"
                on:mouseover={() => {item = { ...item, showDeleteIcon: true } }}
                on:focus={() => {item = { ...item, showDeleteIcon: true } }}
                on:mouseleave={()=> {item = { ...item, showDeleteIcon: false } }}
              >
                {item.emailAddress}
                {#if item.showDeleteIcon}
                  <i class="fas fa-trash-can fa-sm text-red-600 ml-1 cursor-pointer" on:click={() => removeAlertEmail(item)} on:keydown={undefined}/>
                {/if}
              </li>
            {/each}
          {/if}
        </div>
      {/if}
      <!--Footer-->
      <div class="flex justify-end pt-2 mb-3">
        <span on:click={dismiss} on:keypress={dismiss} class="link cursor-pointer">Close</span>
      </div>
    </div>
  </div>
</div>
