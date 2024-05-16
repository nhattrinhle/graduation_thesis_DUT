import axios from 'axios'
import storage from 'redux-persist/lib/storage'
import { persistor, store } from '../redux/store'
import { Token } from '../types/token'
import { signInSuccess, signOutSuccess } from '../redux/reducers/sessionSlice'
import { CODE_RESPONSE_401 } from '../constants/codeResponse.constant'
import { resetUser } from '../redux/reducers/userSlice'

let isRefreshing = false
let failedQueue: any = []

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((promise: any) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

const baseURL = process.env.REACT_APP_BASE_URL

export const axiosInstance = axios.create({ baseURL })

axiosInstance.interceptors.request.use(async (config) => {
  const rawPersistData = await storage.getItem('persist:primary')
  let authToken: Token
  if (rawPersistData !== null) {
    const parsedPersistData = JSON.parse(rawPersistData)
    const sessionState = JSON.parse(parsedPersistData.session)
    authToken = sessionState.tokens
    if (!authToken) {
      const state: any = store.getState()
      authToken = state.session.tokens
    }
  }
  if (authToken!.accessToken) {
    config.headers['Authorization'] = 'Bearer ' + authToken!.accessToken
  }
  return config
})

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === CODE_RESPONSE_401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return axios(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }
      // if the isRefreshing is false then set to true, even with _retry
      originalRequest._retry = true
      isRefreshing = true

      const rawPersistData = await storage.getItem('persist:primary')
      let authToken: Token
      if (rawPersistData !== null) {
        const parsedPersistData = JSON.parse(rawPersistData)
        const sessionState = JSON.parse(parsedPersistData.session)
        authToken = sessionState.tokens

        if (!authToken) {
          const state: any = store.getState()
          authToken = state.session.tokens
        }
      }

      return new Promise(function (resolve, reject) {
        axios
          .post('/user/refreshTokens', { refreshToken: authToken.refreshToken })
          .then(({ data }) => {
            store.dispatch(
              signInSuccess({
                signedIn: true,
                tokens: data.metaData,
              }),
            )
            originalRequest.headers['Authorization'] =
              'Bearer ' + data.metaData.accessToken
            processQueue(null, data.metaData.accessToken)
            resolve(axios(originalRequest))
          })
          .catch((err) => {
            processQueue(err, null)
            reject(err)
            persistor
              .purge()
              .then(() => persistor.flush())
              .then(() => {
                store.dispatch(signOutSuccess())
                store.dispatch(resetUser())
              })
            window.location.href = '/home'
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }
    return Promise.reject(error)
  },
)
