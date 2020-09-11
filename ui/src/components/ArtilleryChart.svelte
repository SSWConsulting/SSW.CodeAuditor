<script>
    import {onMount} from 'svelte';

    export let value = {};

    export let data = {
        datasets: [{
            label: 'Line Dataset',
            data: [0, value.latencyMedian],
            type: 'line',
            order: 1,
            fill: false,
            borderColor: 'orange',
            backgroundColor: '#2196f3', 
            borderWidth: 1 
        }, {
            label: 'Line Dataset',
            data: [0, value.latencyP95],
            type: 'line',
            order: 2,
            fill: false,
            borderColor: 'green',
            backgroundColor: '#2196f3', 
            borderWidth: 1 
        }, {
            label: 'Line Dataset',
            data: [0, value.latencyP99],
            type: 'line',
            order: 2,
            fill: false,
            borderColor: '#2196f3',
            backgroundColor: '#2196f3', 
            borderWidth: 1 
        }]
        };
    
    export let options = {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        legend: {
                display: false
             }
        };

    let chartRef;
    onMount(() => {
        Chart.Line(chartRef, {
        options: options,
        data: data
        });
    });
    
</script>

<style>
    .wrapper {
    height: 500px;
    }
</style>

<div class="wrapper">
<canvas bind:this={chartRef} width="600" height="250"></canvas>
</div>