<script>
    export let value = {};
  </script>
  
  <div class="grid grid-cols-4">
    <div class="col-span-1 text-start">
      <span class="block font-sans">SCANNED</span>
      <span class="font-sans font-bold block lg:inline-block my-2">{value.totalScanned}</span>
    </div>
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">BAD LINKS</span>
      <span
        class="font-sans font-bold block lg:inline-block my-2"
        class:text-red-600={value.totalBrokenLinks > 0}
        class:text-green-600={value.totalBrokenLinks === 0}>
        {value.uniqueBrokenLinks} / {value.totalBrokenLinks}
      </span>
    </div>
    <div class="col-span-1 text-start">
      <span class="block whitespace-no-wrap font-sans">404 ERRORS</span>
      <span
        class="font-sans font-bold block lg:inline-block my-2"
        class:text-red-600={value.totalUnique404 > 0}
        class:text-green-600={value.totalUnique404 === 0}>
        {value.totalUnique404}
      </span>
    </div>
  </div>
  