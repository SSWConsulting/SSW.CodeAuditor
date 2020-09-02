<script>
    import { getArtilleryResult } from "../utils/utils";
    export let value = {};

    let details = value.summary;
    $: atr = getArtilleryResult(details);
  
  </script>
  
  {#if atr.scenariosCompleted}
    <span class="font-sans">Artillery</span>
    <br>
    <table>
    <thead>
        <tr>
            <th class="px-4 py-2">Time </th>
            <th class="px-4 py-2">scenariosCreated</th>
            <th class="px-4 py-2">scenariosCompleted</th>
            <th class="px-4 py-2">requestsCompleted</th>
            <th class="px-4 py-2">latencyMedian</th>
            <th class="px-4 py-2">rpsCount</th>
        </tr>   
    </thead> 
    <tbody>
        <tr>          
            <td class="border px-4 py-2">{atr.timestamp}</td>
            <td class="border px-4 py-2">{atr.scenariosCreated}</td>
            <td class="border px-4 py-2">{atr.scenariosCompleted}</td>
            <td class="border px-4 py-2">{atr.requestsCompleted}</td>
            <td class="border px-4 py-2">{atr.latencyMedian}</td>
            <td class="border px-4 py-2">{atr.rpsCount}</td>
        </tr>  
    </tbody>
    </table>
{/if}
  

  
  