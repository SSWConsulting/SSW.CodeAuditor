<script>
    import {onMount} from 'svelte';
    import { forEach, groupBy, props } from "ramda";

    export let value = [];

    let scanDur = [];
    let score = [];
    
    value.forEach(i => {
        scanDur.push(i.scanDuration)
    })

    value.forEach(i => {
        score.push(i.finalEval)
    })

    let barColor = [];
    score.forEach(i => {
        if (i == 'FAIL'){
            barColor.push('red')
        } else if (i == 'PASS') {
            barColor.push('green')
        } else {
            barColor.push('orange')
        }
    })
     
    export let data = {
            labels: [score[0], score[1], score[2], score[3], score[4]],
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
