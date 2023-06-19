<script>
  import { navigateTo } from "svelte-router-spa";
</script>

<div class="flex items-center justify-center">
  <div class="px-40 py-20">
    <div class="flex flex-col items-center">
      <div class="font-bold text-5xl mb-8">Ooops!</div>

      <div class="textred mb-2 text-2xl font-bold text-center md:text-3xl">
        404 - Page not found
      </div>

      <p class="mb-8 text-center text-gray-500 md:text-lg">
        We're sorry, but it seems like the code is playing hide-and-seek with this page.
      </p>

      <button 
        class="bgred text-white px-6 py-2 font-bold"
        type="button" 
        on:click={() => navigateTo('/')}
      > Go to homepage
      </button>
    </div>
  </div>
</div>