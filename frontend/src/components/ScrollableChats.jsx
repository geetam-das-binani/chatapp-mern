import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
	isLastMessageInGroup,
	isSameSenderMargin,
	isSameUser,
} from "../utils/chatUtils";
import { useSelector } from "react-redux";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChats = ({ messages }) => {
	const { user: loggedUser } = useSelector((state) => state.user);
	return (
		<ScrollableFeed>
			{messages.length > 0 &&
				messages.map((m, i) => (
					<div
						style={{
							display: "flex",
						}}
						key={m._id}
					>
						{isLastMessageInGroup(messages, i) &&
							m.sender._id !== loggedUser.user._id && (
								<Tooltip
									label={m.sender.name}
									hasArrow
									placement="bottom-start"
								>
									<Avatar
										mt="7px"
										mr="1"
										size="sm"
										cursor="pointer"
										name={m.sender.name}
										src={m.sender.pic}
									/>
								</Tooltip>
							)}

						<span
							style={{
								backgroundColor: m.content
									? m.sender._id === loggedUser.user._id
										? "#BEE3F8"
										: "#B9F5D0"
									: "none",

								borderRadius: "20px",
								padding: "5px 15px",
								maxWidth: "75%",
								marginLeft: isSameSenderMargin(messages, m, i, loggedUser),
								marginTop: isSameUser(messages, m, i) ? 3 : 10,
							}}
						>
							{m.content ? (
								m.content
							) : (
								<img
									style={{
										objectFit: "contain",
										width: "10vmax",
										borderRadius: "5px",
									}}
									src={m.image}
									alt="image"
								/>
							)}
						</span>
					</div>
				))}
		</ScrollableFeed>
	);
};

export default ScrollableChats;
