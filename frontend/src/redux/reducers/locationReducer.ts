import { District } from '@/types/district'
import { Province } from '@/types/province'
import { Ward } from '@/types/ward'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface locationState {
  loading: boolean
  error: string | undefined
  districtsList: District[]
  provincesList: Province[]
  wardsList: Ward[]
}

const initialState: locationState = {
  loading: false,
  error: undefined,
  districtsList: [],
  provincesList: [],
  wardsList: [],
}

export const getAllProvinces = createAsyncThunk(
  'location/getAllProvinces',
  async (_, thunkAPI) => {
    const res = await axios.get(`/location/provinces`, {
      signal: thunkAPI.signal,
    })
    const data = res.data.metaData as Province[] // Adjust the type here.
    return data
  },
)

export const getAllDistricts = createAsyncThunk(
  'location/getAllDistricts',
  async (provinceCode: string | undefined, thunkAPI) => {
    const res = await axios.get(
      `/location/districts?provinceCode=${provinceCode}`,
      {
        signal: thunkAPI.signal,
      },
    )
    const data = res.data.metaData as District[] // Adjust the type here.
    return data
  },
)

export const getAllWards = createAsyncThunk(
  'location/getAllWards',
  async (districtCode: string | undefined, thunkAPI) => {
    const res = await axios.get(
      `/location/wards?districtCode=${districtCode}`,
      {
        signal: thunkAPI.signal,
      },
    )
    const data = res.data.metaData as Ward[] // Adjust the type here.
    return data
  },
)

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // add other actions here which are not createAsyncThunk.
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProvinces.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllProvinces.fulfilled, (state, action) => {
      state.loading = false
      state.provincesList = action.payload
      state.error = undefined
    })
    builder.addCase(getAllProvinces.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    builder.addCase(getAllDistricts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllDistricts.fulfilled, (state, action) => {
      state.loading = false
      state.districtsList = action.payload
      state.error = undefined
    })
    builder.addCase(getAllDistricts.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    builder.addCase(getAllWards.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllWards.fulfilled, (state, action) => {
      state.loading = false
      state.wardsList = action.payload
      state.error = undefined
    })
    builder.addCase(getAllWards.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default locationSlice.reducer
