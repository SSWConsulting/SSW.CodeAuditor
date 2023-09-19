<script>
  import { historyChartType } from "../../utils/utils";
  import Chart from 'chart.js/auto';

  export let value = [];
  export let dataType;

  let allDataToDisplay = [];
  let chartTitle;
  let barColor;

  // Categorize and populate charts with data, title and color
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

  // Show top 8 most recent scan in chart
  let dataToDisplay = allDataToDisplay.slice(0, 8).map((data) => data || 0);

  // If a group has less than 8 scans, add the remaining props to populate the chart
  for (let i = 0; i < 8; i++) {
    if (dataToDisplay.length < 8) {
      dataToDisplay.push(0);
    }
  }

  // Populate data label for each column
  let dataToDisplayLabel = dataToDisplay;
  
  // if a group does not have any error at all, prepopulate with a value (1) and re-label as 0
  if (dataToDisplay.every(x => x === 0 || x === undefined)) {
    dataToDisplay = Array(8).fill(1);
    dataToDisplayLabel = Array(8).fill(0);
    barColor = "#eeeeee";
  }

  // Calculate to get max bar height for certain group
  let maxBarHeight = dataToDisplay.length > 0 ? dataToDisplay.reduce((a, b) => Math.max(a, b)) : 0;
  let data = {
    labels: dataToDisplayLabel.map((value) => {
      return Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 0
      }).format(value);
    }),
    datasets: [
      {
        backgroundColor: barColor,
        data: dataToDisplay,
      },
      {
        backgroundColor: "#eeeeee",
        data: Array(8).fill(Math.max(...dataToDisplay)),
        grouped: false,
      }
    ],
  }

  let type = 'bar'

	let options = {
    responsive: true,
    animation: {
        duration: 0
    },
		plugins: {
			legend: {
				display: false
			},
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        display: false,
        max: maxBarHeight,
      },
      x: {
        display: true,
        reverse: true,
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  }
	
	$: config = {
		type,
		data,
		options
	}

  const handleChart = (element, config) => {
		let theChart = new Chart(element, config)
		
		return {
			update(config) {
				theChart.destroy()
				theChart = new Chart(element, config)
			},
			destroy() {
				theChart.destroy()
			}
		}
	}

</script>

<div class="text-left whitespace-no-wrap mb-3">
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
<canvas use:handleChart={config} />