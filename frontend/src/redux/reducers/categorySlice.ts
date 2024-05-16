import { Category } from '@/types/properties'
import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface categoryState {
  loading: boolean
  error: string | undefined
  categoriesList: Category[]
}

const initialState: categoryState = {
  loading: false,
  error: undefined,
  categoriesList: [],
}

export const getAllCategories = createAsyncThunk(
  'category/getAllCategories',
  async (_, thunkAPI) => {
    const res = await axios.get(`/categories`, {
      signal: thunkAPI.signal,
    })
    const data = res.data.metaData as Category[] // Adjust the type here.
    return data
  },
)

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCategories.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.loading = false
      state.categoriesList = action.payload
      state.error = undefined
    })
    builder.addCase(getAllCategories.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default categorySlice.reducer
