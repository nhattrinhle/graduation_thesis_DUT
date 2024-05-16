import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

import ExportData from 'highcharts/modules/export-data'
import Accessibility from 'highcharts/modules/accessibility'
import Exporting from 'highcharts/modules/exporting'
import { primary } from '../../constants/color.constant'

// Initialize the exporting and accessibility modules
ExportData(Highcharts)
Exporting(Highcharts)
Accessibility(Highcharts)

interface DonutChartProps {
  data: any[]
  title?: string
}

// some comments in this component are kept for future use
const DonutChart = ({ data, title }: DonutChartProps) => {
  const options = {
    credits: {
      enabled: false,
    },
    chart: {
      loading: false,
      animation: true,
      styleMode: true,
      type: 'pie',
    },
    title: {
      text: title,
      style: {
        color: primary,
        fontSize: '20px',
        textOutline: 'none',
        fontWeight: 'bold',
      },
    },

    categories: ['Sale', 'Rent'],
    tooltip: {
      valueSuffix: '%',
      pointFormat:
        '<b>{point.name}</b><br>{series.name}: <b>{point.percentage:.1f}%</b> <br> Figure: <b>{point.inNumber}</b>',
      headerFormat: '',
      style: {
        color: 'black',
        fontSize: '1em',
        textOutline: 'none',
        opacity: 1,
      },
    },

    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
      },
      pie: {
        size: 250,
        allowPointSelect: true,
        cursor: 'pointer',
      },
    },

    series: [
      {
        name: 'Percentage',
        data: data[0],
        size: '45%',
        dataLabels: {
          color: '#ffffff',
          distance: '-50%',
          fontsize: '16px',
        },
      },
      {
        name: 'Percentage',
        data: data[1],
        size: '80%',
        innerSize: '60%',
        dataLabels: {
          format:
            '<b style="color: orange; fontSize: 16px">{point.name}:</b> <b style="opacity: 0.9; fontSize: 12px">{point.percentage:.1f}%</b>',
          filter: {
            property: 'y',
            operator: '>',
            value: 0,
          },
          style: {
            fontWeight: 'normal',
          },
        },
        id: 'versions',
      },
    ],
  }

  return (
    <div>
      {data.length > 0 && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  )
}

export default DonutChart
