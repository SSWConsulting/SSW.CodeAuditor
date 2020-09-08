<script>
    import {onMount} from 'svelte';
    import { forEach, groupBy, props } from "ramda";

    export let value = [];

    let scanDur = [];
    
    value.forEach(i => {
        scanDur.push(i.scanDuration)
    })

    console.log(scanDur)

    export let data = {
            labels: ["1", "2", "3", "4", "5"],
            datasets: [{
                data: scanDur,
                backgroundColor: 'green',
            }]
        };
    
    export let options = {
            responsive: true,
            maintainAspectRatio: false,
            scales:{
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        display: false
                }
            }],
                yAxes: [{
                    ticks: {
                        display: false,
                        beginAtZero: true
                    },
                    gridLines: {
                        display: false
                }
            }]
            }, 
            legend: {
                display: false
             },
        };

    let chartRef;
    onMount(() => {
        Chart.Bar(chartRef, {
        options: options,
        data: data
        });
    });
    
</script>

<div class="text-center">
<span class="font-sans">HISTORY</span>
</div>
<canvas bind:this={chartRef} width="10px" height="6px"></canvas>
