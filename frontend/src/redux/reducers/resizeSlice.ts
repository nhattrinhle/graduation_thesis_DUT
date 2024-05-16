import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 1 - define type of state for this slice.
interface ResizeState {
  isSmallScreen: boolean
}

// 2 - init state is needed.
const initialState: ResizeState = {
  isSmallScreen: false,
}

// 3 - createSlice takes 3 params( name will be use in useSelector - state.resize... , initState, reducers to handle actions).
const resizeSlice = createSlice({
  name: 'resize',
  initialState,
  reducers: {
    setIsSmallScreen(state, action: PayloadAction<boolean>) {
      // it will look up to the initState
      state.isSmallScreen = action.payload
    },
  },
})
// 4 - we gotta extract n export action(s) from reducer function above.
export const { setIsSmallScreen } = resizeSlice.actions

export default resizeSlice.reducer
