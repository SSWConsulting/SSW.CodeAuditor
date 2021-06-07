<script>
    import { format } from "date-fns";
    import formatDistanceToNow from "date-fns/formatDistanceToNow";
    import { printTimeDiff, CONSTS } from "../../utils/utils";

    export let val

    function numberWithCommas(x) {
    return x.toLocaleString()
  }
</script>

<span class="font-sans text-base font-bold text-gray-800 underline">
    {format(new Date(val.buildDate), 'dd.MM.yyyy')}
  </span>
  <br />
  <span class="font-sans text-base pt-2">
    Last scanned:
    {formatDistanceToNow(new Date(val.buildDate), { addSuffix: true })}
    at
    {format(new Date(val.buildDate), 'hh:mma')}
  </span>
  <br />
  <span class="font-sans text-base pt-2">
    Duration:
    {printTimeDiff(+val.scanDuration)}
  </span>
  <br />
  <span class="font-sans text-base pt-2">
    Scanned:
    {numberWithCommas(val.totalScanned)}
    items
  </span>