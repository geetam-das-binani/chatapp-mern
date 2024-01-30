import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	notifications: [],
};
export const notificationsReducer = createSlice({
	name: "notifications",
	initialState,

	reducers: {
		setNotifications: (state, action) => {
			if (
				!state.notifications.some(
					(notify) => notify.chats?._id === action.payload.chats?._id
				)
			) {
				state.notifications = [action.payload, ...state.notifications];
			}
		},
		clearNotifications: (state, { payload }) => {
			state.notifications = state.notifications.filter(
				(notify) => notify._id !== payload._id
			);
		},
	},
});
export const { setNotifications, clearNotifications } =
	notificationsReducer.actions;
