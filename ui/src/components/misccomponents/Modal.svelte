<script>
  import LoadingCircle from "./LoadingCircle.svelte";
  import { createEventDispatcher } from "svelte";
  export let show;
  export let header;
  export let loading;
  export let full = false;
  export let mainAction;

  const dispatch = createEventDispatcher();
  const action = () => dispatch("action");

  const dismiss = () => {
    dispatch("dismiss");
    show = false;
  };

  const handleKeydown = event => event.key === "Escape" && dismiss();
</script>

<style>
  .modal {
    transition: opacity 0.2s ease;
    z-index: 3000;
  }
  .fullheight {
    height: 90vh;
  }
  .modal-body {
    height: 72vh;
  }
</style>

<!--Modal-->
<div
  class:opacity-0={!show}
  class:pointer-events-none={!show}
  class="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0
  flex items-center justify-center">
  <div
    class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
    on:click={dismiss}
    on:keydown={undefined} />

  <div
    class={`modal-container bg-white w-11/12 ${full ? 'max-w-6xl' : 'max-w-xl'} mx-auto rounded
    shadow-lg z-50 overflow-y-auto`}>
    <!-- Add margin if you want to see some of the overlay behind the modal-->
    <div
      class="modal-content py-4 text-left px-6"
      class:fullheight={full === true}>
      <!--Title-->
      <div class="flex justify-between items-center mb-4">
        <p class="text-2xl font-bold">{header}</p>
      </div>

      <!--Body-->
      <div class="modal-body overflow-y-auto">
        <slot />
      </div>

      <!--Footer-->
      <div class="flex justify-end pt-2 mb-3">
        {#if mainAction}
          <button
            on:click={action}
            type="button"
            class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
            border hover:border-transparent rounded">
            {mainAction}
            {#if loading}
              <LoadingCircle />
            {/if}
          </button>
        {/if}
        <button
          on:click={dismiss}
          type="button"
          class="bgdark hover:bg-grey-800 font-semibold ml-1 text-white
          hover:text-white py-2 px-4 border hover:border-transparent rounded">
          Close
        </button>
      </div>

    </div>
  </div>
</div>

<svelte:window on:keydown={handleKeydown} />
