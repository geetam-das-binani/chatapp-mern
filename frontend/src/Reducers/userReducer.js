import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	user: localStorage.getItem("userInfo")
		? JSON.parse(localStorage.getItem("userInfo"))
		: null,
};
export const userReducer = createSlice({
	name: "user",
	initialState,

	reducers: {
		registerUser: (state, action) => {
			state.user = action.payload;
			localStorage.setItem("userInfo", JSON.stringify(action.payload));
		},
		loginUser: (state, action) => {
			state.user = action.payload;
			localStorage.setItem("userInfo", JSON.stringify(action.payload));
		},
		logoutUser: (state) => {
			state.user = null;
			localStorage.removeItem("userInfo");
		},
	},
});
export const { registerUser, loginUser, logoutUser } = userReducer.actions;
