import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts/highmaps'
import HighchartsReact from 'highcharts-react-official'
import ExportData from 'highcharts/modules/export-data'
import Accessibility from 'highcharts/modules/accessibility'
import Exporting from 'highcharts/modules/exporting'

ExportData(Highcharts)
Exporting(Highcharts)
Accessibility(Highcharts)


const MapReport = () => {
  const [world, setWorld] = useState<any>()
  const [topology, setTopology] = useState<any>()
  const getMapWorld = async () => {
    await fetch(
      'https://code.highcharts.com/mapdata/custom/world.topo.json',
    ).then((response) => setWorld(response.json()))
  }

  const getVNMap = async () => {
    await fetch(
      'https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json',
    ).then((response) => setTopology(response.json()))
  }

  const data = topology.objects.default.geometries.map((g: any, i: any) => [
    g.properties['hc-key'],
    i % 10,
  ])

  useEffect(() => {
    getMapWorld()
    getVNMap()
  }, [])

  const options = {
    chart: {
      margin: 0,
    },

    title: {
      text: 'Highcharts Map with Locator',
    },

    mapView: {
      padding: [30, 0, 0, 0],
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        align: 'right',
        alignTo: 'spacingBox',
      },
    },

    navigation: {
      buttonOptions: {
        theme: {
          stroke: '#e6e6e6',
        },
      },
    },

    legend: {
      layout: 'vertical',
      align: 'right',
    },

    colorAxis: {
      minColor: '#87c1c3',
      maxColor: '#4ba5a6',
    },

    series: [
      {
        states: {
          inactive: {
            enabled: false,
          },
        },
        name: 'Background map',
        mapData: world,
        affectsMapView: false,
        borderColor: 'rgba(0, 0, 0, 0)',
        nullColor: 'rgba(196, 196, 196, 0.2)',
      },
      {
        name: topology.title || 'Map',
        mapData: topology,
        data,
      },
    ],
  }
  
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={'mapChart'}
      />
    </div>
  )
}

export default MapReport
