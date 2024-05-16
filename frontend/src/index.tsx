import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import axios from 'axios'
import { GoogleOAuthProvider } from '@react-oauth/google'
import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/tiptap/styles.css';
import { REACT_APP_GOOGLE_CLIENT_ID } from './constants/google.constant'

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID!}>
      <PersistGate loading={true} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </GoogleOAuthProvider>
  </Provider>,
)

reportWebVitals()
