import { Properties } from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAllWishListService } from '../../service/PropertyService'

interface propertyState {
  property: Properties | null
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  message: string | undefined
  listFavorites: Properties[]
}

const initialState: propertyState = {
  property: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  listFavorites: [],
}

export const getAllWishList = createAsyncThunk(
  'property/getAllWishList',
  async (_, thunkAPI) => {
    try {
      return await getAllWishListService()
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllWishList.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAllWishList.fulfilled, (state, action) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = true
      state.listFavorites = action.payload
      state.message = 'Get all wish list successfully'
    })
    builder.addCase(getAllWishList.rejected, (state, action) => {
      state.isLoading = false
      state.isError = true
      state.isSuccess = false
      state.property = null
      state.message = action.error.message
    })
  },
})

export default propertySlice.reducer
