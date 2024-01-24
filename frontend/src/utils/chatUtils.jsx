export const getSender = (users, loggedUser) => {
	const sender = users.find((user) => user._id !== loggedUser.user._id);
	return sender.name;
};

export const getSenderFullDetails = (users, loggedUser) => {
	const sender = users.find((user) => user._id !== loggedUser.user._id);
	return sender;
};
export const isSameSender = (messages, m, i, loggedUser) => {
	return (
		(i < messages.length - 1 && messages[i].sender._id !== m.sender._id) ||
		(messages[i + 1].sender._id !== undefined &&
			messages[i + 1].sender._id !== loggedUser.user._id)
	);
};
export const isLastMessage = (messages, i, loggedUser) => {
	const lastMessage = messages[messages.length - 1];
	return (
		i === messages.length - 1 &&
		lastMessage.sender && // Check if 'sender' exists
		lastMessage.sender._id !== loggedUser.user._id
	);
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
		return 33; // Margin for different senders
	} else if (
		(i < messages.length - 1 &&
			messages[i + 1].sender._id !== m.sender._id &&
			messages[i].sender._id !== loggedUser.user._id) ||
		(i === messages.length - 1 &&
			messages[i].sender._id !== loggedUser.user._id)
	) {
		return 0; // Margin for same sender or last message
	} else {
		return "auto"; // Default margin
	}
};

export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
