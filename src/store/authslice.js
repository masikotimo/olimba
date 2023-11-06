import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  userSignUp: null,
  unit_id: null,
  unit_name: null,
  schedule: null,
  isLoggedIn: false,
  ticketId: null,
  paymentId: null,
  scheduleDate: new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    setLogout: (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
    },
    setUnitId: (state, action) => {
      state.unit_id = action.payload
    },
    setUnitName: (state, action) => {
      state.unit_name = action.payload
    },
    setSchedule: (state, action) => {
      state.schedule = action.payload
    },
    setTicketId: (state, action) => {
      state.ticketId = action.payload
    },
    setPaymentId: (state, action) => {
      state.paymentId = action.payload
    },
    setUserSignUp: (state, action) => {
      state.userSignUp = action.payload
    },
    setScheduleDate: (state, action) => {
      state.scheduleDate = action.payload
    }
  },
});

export const { setLogin, setLogout, setUnitId, setUnitName, setSchedule, setTicketId, setPaymentId, setUserSignUp, setScheduleDate } = authSlice.actions;

export default authSlice.reducer;