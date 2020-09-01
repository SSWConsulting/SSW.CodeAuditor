<script>
  export let value = {};
</script>

  <div class="text-center">
    <span class="font-sans">Bad Links</span>
    <br>
    <span
      class="font-sans font-bold block lg:inline-block  m-2"
      class:text-red-600={value.totalBrokenLinks > 0}
      class:text-green-600={value.totalBrokenLinks === 0}>
      {value.totalBrokenLinks}
    </span>
  </div>
