import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./Reducers/userReducer";
import { chatReducer } from "./Reducers/chatReduer";
export const store = configureStore({
	reducer: {
		[userReducer.name]: userReducer.reducer,
		[chatReducer.name]: chatReducer.reducer,
	},
});
