<script>
    import {onMount} from 'svelte';
    import { forEach, groupBy, props } from "ramda";

    export let value = [];
    
    let allScanDur = value.map(i => i.scanDuration);

    let scanDur = allScanDur.slice(0, 10);

    let maxBarHeight = [];
    maxBarHeight = scanDur.reduce(function(a, b) {
        return Math.max(a, b);
    });

    for (let i=0; i < 10; i++){
        if (scanDur.length < 10) {
            scanDur.push(maxBarHeight/10)
        }
    }

    let score = value.map(i => i.finalEval);

    let barColor = score.map(i => {
    if (i === 'FAIL') return 'red';
    if (i === 'PASS') return 'green'; 
    return 'orange';
    });
     
    export let data = {
            labels: scanDur,
            datasets: [{
                data: scanDur,
                backgroundColor: barColor
            }]
        };
    
    export let options = {
            responsive: true,
            maintainAspectRatio: false,
            scales:{
                xAxes: [{
                    maxBarThickness: 5,
                    ticks: {
                        display: false,
                        beginAtZero: true
                    },
                    gridLines: {
                        display: false
                }
            }],
                yAxes: [{
                    ticks: {
                        display: false,
                        max: maxBarHeight,
                        beginAtZero: true,
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
