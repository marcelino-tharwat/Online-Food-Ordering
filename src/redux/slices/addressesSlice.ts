import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  street: string;
  notes: string;
}

interface AddressesState {
  addresses: Address[];
  selectedId: string | null;
}

const initialState: AddressesState = {
  addresses: JSON.parse(localStorage.getItem("savedAddresses") || "[]"),
  selectedId: null,
};

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
      localStorage.setItem("savedAddresses", JSON.stringify(state.addresses));
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
      localStorage.setItem("savedAddresses", JSON.stringify(state.addresses));
    },
    selectAddress(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    updateAddress(state, action: PayloadAction<Address>) {
      const index = state.addresses.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      localStorage.setItem("savedAddresses", JSON.stringify(state.addresses));
    },
  },
});

export const { addAddress, removeAddress, selectAddress, updateAddress } =
  addressesSlice.actions;
export default addressesSlice.reducer;
