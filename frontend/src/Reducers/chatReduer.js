import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	selectedChat: {},
	chats: [],
};
export const chatReducer = createSlice({
	name: "chat",
	initialState,

	reducers: {
		userSelectedChat: (state, action) => {
			state.selectedChat = action.payload;
		},
		userChats: (state, action) => {
			state.chats = action.payload;
		},
	},
});
export const { userSelectedChat, userChats } = chatReducer.actions;
