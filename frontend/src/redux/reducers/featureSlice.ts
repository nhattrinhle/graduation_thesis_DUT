import { Feature } from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface featureState {
  loading: boolean
  error: string | undefined
  featuresList: Feature[]
}

const initialState: featureState = {
  loading: false,
  error: undefined,
  featuresList: [],
}

export const getAllFeatures = createAsyncThunk(
  'feature/getAllFeatures',
  async (_, thunkAPI) => {
    const res = await axios.get(`/features`, {
      signal: thunkAPI.signal,
    })
    const data = res.data.metaData as Feature[] // Adjust the type here.
    return data
  },
)

export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllFeatures.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllFeatures.fulfilled, (state, action) => {
      state.loading = false
      state.featuresList = action.payload
      state.error = undefined
    })
    builder.addCase(getAllFeatures.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default featureSlice.reducer
