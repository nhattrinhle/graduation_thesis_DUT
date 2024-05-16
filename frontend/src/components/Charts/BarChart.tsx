import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import ExportData from 'highcharts/modules/export-data'
import Accessibility from 'highcharts/modules/accessibility'
import Exporting from 'highcharts/modules/exporting'
import './PieChart.css'
import { getDaysOfWeekWithTodayLast } from '../../utils/commonFunctions'

ExportData(Highcharts)
Exporting(Highcharts)
Accessibility(Highcharts)

interface BarChartProps {
  depositedCreditsLastWeek: number[]
  depositedCreditsThisWeek: number[]
  title?: string
  seriesName?: string
  yAxisLabel?: string
}
const BarChart = ({
  depositedCreditsLastWeek,
  depositedCreditsThisWeek,
  title,
}: BarChartProps) => {
  const options = {
    exporting: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },

    chart: {
      type: 'column',
      height: 350,
    },

    title: {
      text: title,
    },
    xAxis: {
      crosshair: true,
      grouping: false,
      categories: getDaysOfWeekWithTodayLast(),
    },
    yAxis: {
      title: {
        text: '$ - Dollars',
      },
    },

    plotOptions: {
      column: {
        grouping: true,
        pointPadding: 0.2,
        borderWidth: 0,
        pointWidth: 20,
      },
    },
    series: [
      {
        name: 'Last Week',
        data: depositedCreditsLastWeek,
      },
      {
        name: 'This Week',
        data: depositedCreditsThisWeek,
      },
    ],
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        return (
          '<span style="color:' +
          this.series.color +
          '">' +
          this.series.name +
          '</span>: <b style="color:black">$' +
          this.y +
          '</b><br/>'
        )
      },
    },
  }

  return (
    <>
      {depositedCreditsLastWeek.length > 0 &&
        depositedCreditsThisWeek.length > 0 && (
          <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        )}
    </>
  )
}

export default BarChart
