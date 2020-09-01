<script>
    import {onMount} from 'svelte';
    export let value = [];
    
    let score;
    let barColor1;
    let barColor2;
    let barColor3;
    let barColor4;
    let barColor5;
    
    if (value.firstBuild.totalBrokenLinks > 0 ||
        value.firstBuild.htmlWarnings > 0) {
        score = "Fail";
        barColor1 = "red"
    } else {
        barColor1 = "green"
    }
    
    if (value.secondBuild.totalBrokenLinks > 0 ||
        value.secondBuild.htmlWarnings > 0) {
        score = "Fail";
        barColor2 = "red"
    } else {
        barColor2 = "green"
    }
    
    if (value.thirdBuild.totalBrokenLinks > 0 ||
        value.thirdBuild.htmlWarnings > 0) {
        score = "Fail";
        barColor3 = "red"
    } else {
        barColor3 = "green"
    }
    
    if (value.fourthBuild.totalBrokenLinks > 0 ||
        value.fourthBuild.htmlWarnings > 0) {
        score = "Fail";
        barColor4 = "red"
    } else {
        barColor4 = "green"
    }
    
    if (value.fifthBuild.totalBrokenLinks > 0 ||
        value.fifthBuild.htmlWarnings > 0) {
        score = "Pass";
        barColor5 = "red"
    } else {
        barColor5 = "green"
    }
    
    var data = {
            labels: ["1", "2", "3", "4", "5"],
            datasets: [{
                backgroundColor: [barColor1, barColor2, barColor3, barColor4, barColor5],
                data: [value.fifthBuild.scanDuration, value.fourthBuild.scanDuration, value.thirdBuild.scanDuration, value.secondBuild.scanDuration, value.firstBuild.scanDuration ]
            }]
        };
    
    var options = {
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
    
onMount(() => {
    Chart.Bar('chart', {
      options: options,
      data: data
    })
    });
    
</script>
    
<canvas id="chart" width="10px" height="6px"></canvas>