<script>
  export let value = {};
  import { Navigate, navigateTo } from "svelte-router-spa";
</script>

  <div class="text-center" on:click={() => navigateTo(`/build/${value[0].runId}`)}>
    <span class="font-sans">Bad Links</span>
    <br>
    <span
      class="font-sans font-bold block lg:inline-block m-2"
      class:text-red-600={value[0].totalBrokenLinks > 0}
      class:text-green-600={value[0].totalBrokenLinks === 0}>
      {value[0].totalBrokenLinks}
    </span>
  </div>
