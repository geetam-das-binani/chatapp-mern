export const getSender = (users, loggedUser) => {
	const sender = users.find((user) => user._id !== loggedUser.user._id);
	return sender.name;
};

export const getSenderFullDetails = (users, loggedUser) => {
	const sender = users.find((user) => user._id !== loggedUser.user._id);
	return sender;
};
