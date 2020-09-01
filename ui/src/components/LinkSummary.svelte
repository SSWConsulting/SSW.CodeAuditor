<script>
  export let value = {};
  export let url;
  import { Navigate, navigateTo } from "svelte-router-spa";

  let filterValue = value.filter(function(values) {
    return values.url == url;
  })

</script>

  <div class="text-center" on:click={() => navigateTo(`/build/${filterValue[0].runId}`)}>
    <span class="font-sans">Bad Links</span>
    <br>
    <span
      class="font-sans font-bold block lg:inline-block m-2"
      class:text-red-600={filterValue[0].totalBrokenLinks > 0}
      class:text-green-600={filterValue[0].totalBrokenLinks === 0}>
      {filterValue[0].totalBrokenLinks}
    </span>
  </div>
