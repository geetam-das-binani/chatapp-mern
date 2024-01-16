import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./Reducers/userReducer";
export const store = configureStore({
	reducer: {
		[userReducer.name]: userReducer.reducer,
	},
});
