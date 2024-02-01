import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./Reducers/userReducer";
import { chatReducer } from "./Reducers/chatReduer";
import { notificationsReducer } from "./Reducers/notificationsReducer";
import { onlineUsersReducer } from "./Reducers/onlineReducer";
export const store = configureStore({
	reducer: {
		[userReducer.name]: userReducer.reducer,
		[chatReducer.name]: chatReducer.reducer,
		[notificationsReducer.name]: notificationsReducer.reducer,
		[onlineUsersReducer.name]: onlineUsersReducer.reducer,
	},
});
