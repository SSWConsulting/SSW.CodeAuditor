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
    allDataToDisplay = value.map((i) => i.totalBrokenLinks);
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

  let dataToDisplay = allDataToDisplay.slice(0, 10);

  let maxBarHeight = [];
  maxBarHeight = dataToDisplay.reduce(function (a, b) {
    return Math.max(a, b);
  });

  for (let i = 0; i < 10; i++) {
    if (dataToDisplay.length < 10) {
      dataToDisplay.push(maxBarHeight / 10);
    }
  }

  export let data = {
    labels: dataToDisplay,
    datasets: [
      {
        data: dataToDisplay,
        backgroundColor: barColor,
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
          return `${items.value}`
        },

        //only returns something when at least one dataset yLabel is a valid number.
        title: function(t, e) {
          return 'Bad links'
        }
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
