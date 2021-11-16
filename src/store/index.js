import { configureStore } from "@reduxjs/toolkit";
import membersSlice from "./members/members-slice";
const store = configureStore({
  reducer: {
    members: membersSlice.reducer,
  },
});

export default store;
