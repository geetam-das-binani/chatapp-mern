import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import { useSelector } from "react-redux";
const App = () => {
	const { user } = useSelector((state) => state.user);

	return (
		<div className="app">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route
						path="/chats"
						element={
							<ProtectedRoute isAuthenticated={user ? true : false}>
								<ChatPage />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
