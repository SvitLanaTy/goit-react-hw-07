import { createSelector, createSlice } from "@reduxjs/toolkit";

import { addContact, deleteContact, fetchContacts } from "./contactsOps";
import { selectContacts, selectFilterName } from "./selectors";

const INITIAL_STATE = {
  items: [],
  loading: false,
  error: null,
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, handlePending)
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, handleRejected)
      .addCase(addContact.pending, handlePending)
      .addCase(addContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(addContact.rejected, handleRejected)
      .addCase(deleteContact.pending, handlePending)
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = state.items.filter(
          (contact) => contact.id !== action.payload.id
        );
      })
      .addCase(deleteContact.rejected, handleRejected);
  },
});

export const selectFilteredContacts = createSelector(
  [selectContacts, selectFilterName],
  (contacts, valueFilter) => {
    if (Array.isArray(contacts)) {
      return contacts.filter((contact) =>
        contact.name.toLowerCase().includes(valueFilter.toLowerCase())
      );
    } else {
      return [];
    }
  }
);

export const contactsReducer = contactsSlice.reducer;
