export const getSender = (users, loggedUser) => {
	const sender = users.find((user) => user._id !== loggedUser.user._id);
	return sender.name;
};

export const getSenderFullDetails = (users, loggedUser) => {
	const sender = users.find((user) => user._id !== loggedUser.user._id);
	return sender;
};

export const getSenderId = (users, loggedUser) => {
	const sender = users.find((user) => user._id !== loggedUser.user._id);
	return sender._id;
};

export const isLastMessageInGroup = (messages, i) => {
	const currentSender = messages[i];
	const nextSender = i < messages.length - 1 ? messages[i + 1] : null;
	return !nextSender || currentSender.sender._id !== nextSender.sender._id;
};
export const isSameSenderMargin = (messages, m, i, loggedUser) => {
	if (m.sender._id === loggedUser.user._id) {
		return "auto"; // Margin for logged-in user's messages
	} else if (
		i < messages.length - 1 &&
		messages[i + 1].sender._id === m.sender._id
	) {
		return 0; // Margin for same senders
	} else if (
		(i < messages.length - 1 &&
			messages[i + 1].sender._id !== m.sender._id &&
			messages[i].sender._id !== loggedUser.user._id) ||
		(i === messages.length - 1 &&
			messages[i].sender._id !== loggedUser.user._id)
	) {
		// Margin for different  sender and last message
		return 0; // Margin for different  sender or last message
	} else {
		return "auto"; // Default margin
	}
};

export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isUserOnline = (onlineUsers, users, loggedUser) => {
	const onlineUser = onlineUsers.find(
		(u) => u.userId === getSenderId(users, loggedUser)
	);

	return !onlineUser ? false : onlineUser.status;
};
export const getUserLastOnlineTime = (onlineUsers, users, loggedUser) => {
	const onlineUser = onlineUsers.find(
		(u) => u.userId === getSenderId(users, loggedUser)
	);

	return !onlineUser ? "" : formattedDate(onlineUser.lastOnline);
};
function formattedDate(date) {
	if (!date) return "";
	const [month, day, year] = new Date(date).toLocaleDateString().split("/");
	const [hr, min, ...rest] = new Date(date).toLocaleTimeString().split(":");
	return `${hr}:${min} ${rest.join("").slice(2)} ${day}/${month}/${year}`;
}
