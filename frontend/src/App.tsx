import React, { Suspense } from 'react'
import './App.css'
import Layouts from './components/layouts/Layouts'
import LoadingPage from './components/LoadingPage/LoadingPage'
import { MantineProvider } from '@mantine/core'
import '@mantine/dates/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/dates'

function App() {
  return (
    <MantineProvider>
      <Suspense fallback={<LoadingPage></LoadingPage>}>
        <Layouts />
      </Suspense>
    </MantineProvider>
  )
}

export default App
