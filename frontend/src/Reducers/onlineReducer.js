import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

const initialState = {
	onlineUsers: [],
};
export const onlineUsersReducer = createSlice({
	name: "onlineUsers",
	initialState,

	reducers: {
		setOnlineUsers: (state, action) => {
			state.onlineUsers = action.payload;
		},
	},
});
export const { setOnlineUsers } = onlineUsersReducer.actions;
