import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  membersData: [],
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    saveMembersDataToStore(state, action) {
      state.membersData = action.payload;
    },
    deleteMember(state, action) {
      const id = action.payload;
      state.membersData = state.membersData.filter(
        (member) => member.id !== id
      );
    },
    deleteSelected(state, action) {
      const ids = action.payload;
      state.membersData = state.membersData.filter(
        (member) => ids.indexOf(member.id) === -1
      );
    },
    editMember(state, action) {
      const modifiedMember = action.payload;
      const index = state.membersData.findIndex(
        (member) => member.id === modifiedMember.id
      );
      state.membersData[index] = modifiedMember;
    },
  },
});

export const membersActions = membersSlice.actions;

export default membersSlice;
