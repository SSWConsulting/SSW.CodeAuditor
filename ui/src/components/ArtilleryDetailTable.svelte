<script>
    import { format } from 'date-fns';
    import formatDistanceToNow from "date-fns/formatDistanceToNow";
    export let value = {};

    let details = value.summary;
</script>

<style>
     hr { 
        border-top: 0.5px solid #e8e8e8;
        } 
</style>
  
<div class="grid gap-x-20 gap-y-4 grid-flow-row grid-cols-6 my-5 font-sans text-gray-700">
        <div class="col-span-7 font-bold">
            Report completed: {formatDistanceToNow(new Date(details.buildDate), {addSuffix: true})} at {format(new Date(details.buildDate), 'hh:mm')}
        </div>
        <div class="col-span-2">
            <h5 class="float-left">Scenarios launched</h5>
            <div class="text-right float-right font-bold">{details.scenariosCreated}</div>
        </div>
        <div class="col-span-4 font-bold">
            Request Latency
        </div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-4">
            <hr>
        </div>
        <div class="col-span-2">
            <h5 class="float-left">Scenarios completed</h5>
            <div class="text-right float-right font-bold">{details.scenariosCompleted}</div> 
        </div>       
        <div class="col-span-2">
            <h5 class="float-left">Min</h5>
            <div class="text-right float-right font-bold">{details.latencyMin} (ms)</div>
        </div>
        <div class="col-span-2">
            <h5 class="float-left">Max</h5>
            <div class="text-right float-right font-bold">{details.latencyMax} (ms)</div>
        </div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-2">
            <h5 class="float-left">Requests completed</h5>
            <div class="text-right float-right font-bold">{details.requestsCompleted}</div>
        </div>
        <div class="col-span-2">
            <h5 class="float-left">Median</h5>
            <div class="text-right float-right font-bold">{details.latencyMedian} (ms)</div>
        </div>
        <div class="col-span-2"></div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-2">
        </div>
        <div class="col-span-2">
            <h5 class="float-left">RPS sent</h5>
            <div class="text-right float-right font-bold">{details.rpsCount}</div>
        </div>
        <div class="col-span-2">
            <h5 class="float-left">p95</h5>
            <div class="text-right float-right font-bold">{details.latencyP95} (ms)</div>
        </div>
        <div class="col-span-2">
            <h5 class="float-left">p99</h5>
            <div class="text-right float-right font-bold">{details.latencyP99} (ms)</div>
        </div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-2">
            <hr>
        </div>
        <div class="col-span-2">
            <hr>
        </div>
</div>


  
  