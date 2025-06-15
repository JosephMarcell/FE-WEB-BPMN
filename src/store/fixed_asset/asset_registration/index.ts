import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AssetRegistrationState {
  value: number;
  modalRegister: boolean;
}

const initialState: AssetRegistrationState = {
  value: 0,
  modalRegister: false,
};

const assetRegistrationSlice = createSlice({
  name: 'assetRegistration',
  initialState: initialState,
  reducers: {
    increment: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    decrement: (state, action: PayloadAction<number>) => {
      state.value -= action.payload;
    },
    setModalRegister: (state, action: PayloadAction<boolean>) => {
      state.modalRegister = action.payload;
    },
  },
});

export const { increment, decrement, setModalRegister } =
  assetRegistrationSlice.actions;
export default assetRegistrationSlice.reducer;
