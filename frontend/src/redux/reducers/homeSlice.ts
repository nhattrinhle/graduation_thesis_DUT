import { Properties } from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

interface HomeState {
  loading: boolean
  error: string | undefined
  propertiesListForSale: Properties[]
  propertiesListForRent: Properties[]
}

const initialState: HomeState = {
  loading: false,
  error: undefined,
  propertiesListForSale: [],
  propertiesListForRent: [],
}


export const getAllPropertiesForSale = createAsyncThunk(
  'properties/getAllpropertiesForSale',
  async (_, thunkAPI) => {
    const res = await axios.get(`/properties?featureId=1&limit=1000000000`, {
      signal: thunkAPI.signal,
    })
    const data = res.data.metaData.data as Properties[] // Adjust the type here
    return data
  },
)

export const getAllPropertiesForRent = createAsyncThunk(
  'properties/getAllpropertiesForRent',
  async (_, thunkAPI) => {
    const res = await axios.get(`/properties?featureId=2&limit=1000000000`, {
      signal: thunkAPI.signal,
    })
    const data = res.data.metaData.data as Properties[] // Adjust the type here
    return data
  },
)

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // add other actions here which are not createAsyncThunk.
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPropertiesForSale.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllPropertiesForSale.fulfilled, (state, action) => {
      state.loading = false
      state.propertiesListForSale = action.payload
      state.error = undefined
    })
    builder.addCase(getAllPropertiesForSale.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })

    builder.addCase(getAllPropertiesForRent.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllPropertiesForRent.fulfilled, (state, action) => {
      state.loading = false
      state.propertiesListForRent = action.payload
      state.error = undefined
    })
    builder.addCase(getAllPropertiesForRent.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export const propertiesSelector = (state: RootState) => state.home
export default homeSlice.reducer
