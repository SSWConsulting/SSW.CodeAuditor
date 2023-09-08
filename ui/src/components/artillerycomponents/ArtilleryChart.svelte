<script>
    import {onMount} from 'svelte';
    import { format } from 'date-fns';
    import Chart from 'chart.js/auto';

    export let value;
  
    let latencyMedian = [];
    let latencyP95 = [];
    let latencyP99 = [];
    let timestamp = [];
    
    value.forEach(i => {
        if (i.fullLatencyMedian !== null ||
        i.fullLatencyP99 !== null ||
        i.fullLatencyP99 !== null) 
        {
            timestamp.push(format(new Date(i.fullTimestamp), 'HH:mm:ss'));
            latencyMedian.push(i.fullLatencyMedian);
            latencyP99.push(i.fullLatencyP99);
            latencyP95.push(i.fullLatencyP95)
        }
    })

    let data = {
        labels: timestamp,
        datasets: [{
            label: 'latency Median',
            data: latencyMedian, 
            fill: false,
            borderColor: 'orange',
            borderWidth: 1 
        }, {
            label: 'latency P95',
            data: latencyP95,
            fill: false,
            borderColor: 'green',
            borderWidth: 1 
        }, {
            label: 'latency P99',
            data: latencyP99,
            fill: false,
            borderColor: 'red',
            borderWidth: 1 
        }]
        };
    
    let options = {
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Millisecond (ms)',
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time (hh:mm:ss)',
                }
            }
        },};

    let chartRef;
    onMount(() => {
        new Chart(chartRef, {
            type: 'line',
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
