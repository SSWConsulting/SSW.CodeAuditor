<script>
  import { onMount } from "svelte";
  import { historyChartType } from "../../utils/utils";

  export let value = [];
  export let dataType;

  let allDataToDisplay = [];
  let chartTitle;
  let barColor;

  if (dataType === historyChartType.BadLinks) {
    chartTitle = historyChartType.BadLinks;
    allDataToDisplay = value.map((i) => i.totalUnique404);
    barColor = 'red'
  } else if (dataType === historyChartType.WarningCode) {
    chartTitle = historyChartType.WarningCode;
    allDataToDisplay = value.map((i) => i.htmlWarnings);
    barColor = 'orange'
  } else {
    chartTitle = historyChartType.ErrorCode;
    allDataToDisplay = value.map((i) => i.htmlErrors);
    barColor = 'red'
  }

  // Show top 10 most recent scan in chart and filter undefined data
  let dataToDisplay = allDataToDisplay.slice(0, 10);

  let barColorArr = []
  dataToDisplay = dataToDisplay.map(x => {
    if (x === 0) {
      // If a scan has 0 error then change bar color to green
      barColorArr.push('green');
      // Add max value so it will display at full height 
      return x = Math.max(...dataToDisplay) + 10
    } else {
      barColorArr.push(barColor)
      return x
    }
  })

  let dataToDisplayLabel = []

  dataToDisplayLabel = dataToDisplay.map(x => {
      // Find scan with no error by finding number with max value 
      return x === (Math.max(...dataToDisplay)) ? 0 : x
  })

  // Calculate to get max bar height for certain group
  let maxBarHeight = dataToDisplay.length > 0 ? dataToDisplay.reduce((a, b) => Math.max(a, b)) : 0;

  // If a group has less than 10 scans, add the remaining props to populate the chart
  for (let i = 0; i < 10; i++) {
    if (dataToDisplay.length < 10) {
      dataToDisplay.push(maxBarHeight / 10);
    }
  }

  export let data = {
    labels: dataToDisplayLabel,
    datasets: [
      {
        data: dataToDisplay,
        backgroundColor: barColorArr,
        maxBarThickness: 5
      },
    ],
  };

  export let options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
            beginAtZero: true,
            reverse: true,
          },
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
            max: maxBarHeight,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        //returns a empty string if the label is "No Data"
        label: function(items, data){
          return null
        },
      }
    },
  };

  let chartRef;
  onMount(() => {
    Chart.Bar(chartRef, {
      options: options,
      data: data,
    });
  });
</script>

<div class="text-center">
  <span class="inline-block font-sans sm:text-sm">{chartTitle}</span>
  <svg
    class="inline-block w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
</div>
<canvas bind:this={chartRef} width="10px" />
