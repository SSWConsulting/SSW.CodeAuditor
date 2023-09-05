<script>
  import { historyChartType } from "../../utils/utils";
  import Chart from 'chart.js/auto'

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
  let dataToDisplay = allDataToDisplay.slice(0, 8);

  // If a group has less than 8 scans, add the remaining props to populate the chart
  for (let i = 0; i < 8; i++) {
    if (dataToDisplay.length < 8) {
      dataToDisplay.push(0);
    }
  }

  // Calculate to get max bar height for certain group
  let maxBarHeight = dataToDisplay.length > 0 ? dataToDisplay.reduce((a, b) => Math.max(a, b)) : 0;
  
  let data = {
    labels: dataToDisplay,
    datasets: [
      {
        backgroundColor: barColor,
        data: dataToDisplay,
        tension: 0.32,
        borderWidth: 0.1,
      },
      {
        backgroundColor: "#eeeeee",
        data: Array(8).fill(Math.max(...dataToDisplay)),
        tension: 0.32,
        borderWidth: 0.1,
        grouped: false
      }
    ],
  }

  let type = 'bar'

	let options = {
    responsive: true,
		plugins: {
			legend: {
				display: false
			},
      tooltip: {
        callbacks: {
          label: function(context) {
            return null;
          }
        }
      }
    },
    scales: {
			y: {
        display: false,
        max: maxBarHeight,
      },
			 x: {
				 display: false,
         reverse: true
			 }
    }
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

<div class="text-center whitespace-no-wrap">
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