import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  userSignUp: null,
  unit_id: null,
  unit_name: null,
  schedule: null,
  isLoggedIn: false,
  isReset: false,
  ticketId: null,
  paymentId: null,
  phoneNumber: null,
  hasTickets: false,
  paymentDetails: {},
  paymentScheduleDetails: {},
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
        state.unit_id = null;
    },
    setUnitId: (state, action) => {
      state.unit_id = action.payload;
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
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setIsReset: (state, action) => {
      state.isReset = action.payload
    },
    setHasTickets: (state, action) => {
      state.hasTickets = action.payload
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload
    },
    setPaymentScheduleDetails: (state, action) => {
      state.paymentScheduleDetails = action.payload
    }
  },
});

export const { setLogin, setLogout, setUnitId, setUnitName, setSchedule, setTicketId, setPaymentId, setUserSignUp, setScheduleDate, setPhoneNumber, setIsReset, setPaymentDetails, setPaymentScheduleDetails} = authSlice.actions;

export default authSlice.reducer;