<script>
  import { fade, fly } from "svelte/transition";
  export let show;
  export let mode = "success";
  export let timeout = 5000;
  $: if (show) {
    setTimeout(() => {
      show = false;
    }, timeout);
  }
</script>

{#if show}
  <div
    on:click={() => (show = false)}
    in:fly={{ y: 100, duration: 400 }}
    out:fade={{ y: -100, duration: 250 }}
    class:bg-teal-100={mode === 'success'}
    class:text-teal-900={mode === 'success'}
    class:border-teal-500={mode === 'success'}
    class:bg-red-100={mode === 'error'}
    class:text-red-900={mode === 'error'}
    class:border-red-500={mode === 'error'}
    class:bg-orange-100={mode === 'warn'}
    class:text-orange-900={mode === 'warn'}
    class:border-orange-500={mode === 'warn'}
    class="mx-auto cursor-pointer z-auto mt-6 mr-12 fixed top-0 right-0
    border-t-4 rounded-b px-4 py-3 shadow-md toast"
    title="click to dismiss"
    role="alert">
    <div class="flex">
      <div class="py-1">
        <svg
          class:bg-teal-100={mode === 'success'}
          class:text-teal-900={mode === 'success'}
          class:border-teal-500={mode === 'success'}
          class:bg-red-100={mode === 'error'}
          class:text-red-900={mode === 'error'}
          class:border-red-500={mode === 'error'}
          class:bg-orange-100={mode === 'warn'}
          class:text-orange-900={mode === 'warn'}
          class:border-orange-500={mode === 'warn'}
          class="fill-current h-6 w-6 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20">
          <path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93
            17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9
            11V9h2v6H9v-4zm0-6h2v2H9V5z" />
        </svg>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
{/if}
