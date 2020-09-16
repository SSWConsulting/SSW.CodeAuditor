<script>
    import {onMount} from 'svelte';
    import { format } from 'date-fns';

    export let value;
  
    let latencyMedian = [];
    let latencyP95 = [];
    let latencyP99 = [];
    let timestamp = [];
    
    value.forEach(i => {
        timestamp.push(format(new Date(i.fullTimestamp), 'HH:mm:ss'));
        latencyMedian.push(i.fullLatencyMedian);
        latencyP99.push(i.fullLatencyP99);
        latencyP95.push(i.fullLatencyP95)
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
            yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Millisecond (ms)'
            }
            }],
            xAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Time (hh:mm:ss)'
            }
            }]
        },};

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