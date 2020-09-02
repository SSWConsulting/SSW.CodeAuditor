<script>
    export let value = {};
  </script>
  
  <div class="grid grid-cols-3 gap-1 row-gap-2">
    <div class="text-center">
      <span class="block font-mono">Scanned</span>
      <span class="font-bold block">{value.totalScanned}</span>
    </div>
    <div class="text-center">
      <span class="block whitespace-no-wrap font-mono">Bad</span>
      <span
        class="font-bold whitespace-no-wrap"
        class:text-red-600={value.totalBrokenLinks > 0}
        class:text-green-600={value.totalBrokenLinks === 0}>
        {value.uniqueBrokenLinks} / {value.totalBrokenLinks}
      </span>
    </div>
    <div class="text-center">
      <span class="block whitespace-no-wrap font-mono">404</span>
      <span
        class="font-bold"
        class:text-red-600={value.totalUnique404 > 0}
        class:text-green-600={value.totalUnique404 === 0}>
        {value.totalUnique404}
      </span>
    </div>
  </div>
  