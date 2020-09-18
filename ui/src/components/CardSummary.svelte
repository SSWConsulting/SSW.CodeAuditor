<script>
    import { format } from 'date-fns';
    import formatDistanceToNow from "date-fns/formatDistanceToNow";
    export let value;
</script>

<div class="grid grid-rows-2">
    <div class="text-center">
      <span class="text-4xl font-sans font-bold text-gray-800">{format(new Date(value.buildDate), 'dd.MM.yyyy')}</span>
    </div>
    <div class="text-center">
      <span class="text-xl font-sans block lg:inline-block text-gray-600">Last scanned: {formatDistanceToNow(new Date(value.buildDate), {addSuffix: true})} at {format(new Date(value.buildDate), 'hh:mm')}</span>
    </div>
    <div class="text-center">
      <a href="{value.url}" target="_blank" class="underline font-sans text-xl">{value.url}</a>
    </div>
</div>