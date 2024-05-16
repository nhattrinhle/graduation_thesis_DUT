import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getItem } from '../../utils/localStorage'

interface AuthState {
  isLogin: boolean
  accessToken: string | null
  user: Record<string, any>
  error: string
  loading: boolean
}

interface ErrorResponse {
  message: string
  // Add other properties if needed.
}

const initialState: AuthState = {
  isLogin: false,
  accessToken: getItem('token')?.tokens.accessToken || null,
  user: getItem('user') || {},
  error: '',
  loading: true,
}

export const postLoginAction = createAsyncThunk(
  'authentication/postLoginAction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/login`, data)
      const responseData = response.data
      return responseData
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle Axios errors with response (HTTP errors).
        return rejectWithValue(error.response.data as ErrorResponse)
      } else {
        // Handle other errors (network errors, etc.).
        return rejectWithValue({
          message: 'An error occurred',
        } as ErrorResponse)
      }
    }
  },
)

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postLoginAction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postLoginAction.fulfilled, (state, action) => {
      const { token, user } = action.payload
      return {
        ...state,
        isLogin: true,
        accessToken: token,
        user,
        loading: false,
      }
    })
    builder.addCase(postLoginAction.rejected, (state, action) => {
      state.isLogin = false
      state.error = action.payload
        ? (action.payload as ErrorResponse).message
        : 'An error occurred'
      state.accessToken = null
      state.user = {}
      state.loading = false
    })
  },
})

export default authSlice.reducer
