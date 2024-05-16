import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Token } from '../../types/token'

export interface SessionState {
  signedIn: boolean
  tokens: Token | null
}

const initialState: SessionState = {
  signedIn: false,
  tokens: null,
}

const sessionSlice = createSlice({
  name: `session`,
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<SessionState>) {
      state.signedIn = true
      state.tokens = action.payload.tokens
    },
    signOutSuccess(state) {
      state.signedIn = false
      state.tokens = null
    },
  },
})

export const { signInSuccess, signOutSuccess } = sessionSlice.actions
export default sessionSlice.reducer
