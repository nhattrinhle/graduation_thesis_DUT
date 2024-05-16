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

interface DoubleLineChartProps {
  data1: []
  data2: []
  title?: string
}

const DoubleLineChart = ({ data1, data2, title }: DoubleLineChartProps) => {
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
      type: 'spline',
    },
    title: {
      text: title,
    },

    xAxis: {
      labels: {
        formatter: function (
          this: Highcharts.AxisLabelsFormatterContextObject,
        ): string {
          return Highcharts.dateFormat('%b %e', Number(this.value))
        },
      },
      tickInterval: data1.length > 14 ? 7 * 24 * 3600 * 1000 : 24 * 3600 * 1000,
      opposite: false,
    },
    yAxis: {
      opposite: false,
      title: {
        text: 'Credits - Dollars',
      },
    },
    legend: {
      itemStyle: {
        fontSize: '14px',
      },
    },
    series: [
      {
        name: 'Credits',
        marker: {
          symbol: 'diamond',
          radius: 6,
        },
        data: data1,
      },
      {
        name: 'Dollars',
        marker: {
          symbol: 'triangle',
          radius: 6,
        },
        data: data2,
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
      headerFormat:
        '<span style="font-size: 10px">{point.key:%A, %e %b %Y}</span><br/>',
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b style="color:black">{point.y}</b><br/>',
    },
  }

  useEffect(() => {
    options.series[0].data = data1
    options.series[1].data = data2
  }, [data1, data2])

  return (
    <div>
      {data1.length > 0 && data2.length > 0 && (
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

export default DoubleLineChart
