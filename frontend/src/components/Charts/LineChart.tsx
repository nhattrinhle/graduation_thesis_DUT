import React, { useEffect } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import ExportData from 'highcharts/modules/export-data'
import Accessibility from 'highcharts/modules/accessibility'
import Exporting from 'highcharts/modules/exporting'
import './PieChart.css'

ExportData(Highcharts)
Exporting(Highcharts)
Accessibility(Highcharts)

interface LineChartProps {
  data: []
  title?: string
  seriesName?: string
  yAxisLabel?: string
}
const LineChart = ({ data, title, seriesName, yAxisLabel }: LineChartProps) => {
  const options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'spline',
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
    },

    exporting: {
      enabled: true,
    },
    title: {
      text: title,
    },
    // subtitle: {
    //   text: 'milliseconds',
    // },
    // this comment can be used in the future.
    // _navigator: {
    //   enabled: false,
    // },

    xAxis: {
      labels: {
        formatter: function (
          this: Highcharts.AxisLabelsFormatterContextObject,
        ): string {
          return Highcharts.dateFormat('%b %e', Number(this.value))
        },
      },
      tickInterval: data.length > 14 ? 7 * 24 * 3600 * 1000 : 24 * 3600 * 1000,
    },

    yAxis: {
      opposite: false,
      title: {
        text: yAxisLabel,
      },
    },
    series: [
      {
        name: seriesName,
        data: data,
      },
    ],
    plotOptions: {
      spline: {
        dataLabels: {
          enabled: true,
          formatter(this: Highcharts.PointLabelObject) {
            if (this.y === 0) {
              return ''
            } else {
              return String(this.y)
            }
          },
        },
      },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        return (
          '<small style="fontSize:12px">' +
          Highcharts.dateFormat('%A, %e %b %Y', Number(this.x)) +
          '</small><br/>' +
          '<span style="color:' +
          this.series.color +
          '">' +
          this.series.name +
          '</span>: <b style="color:black">' +
          this.y +
          '</b><br/>'
        )
      },
    },
  }

  useEffect(() => {
    options.series[0].data = data
  }, [data])

  return (
    <div>
      {data.length > 0 && (
        <HighchartsReact
          highcharts={Highcharts}
          // constructorType={'stockChart'}
          options={options}
          updateArgs={[true, true, true]}
        />
      )}
    </div>
  )
}

export default LineChart
