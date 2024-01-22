import React from "react";
import ScrollableFeed from "react-scrollable-feed";
const ScrollableChats = ({ messages }) => {
	return (
		<ScrollableFeed>
			{messages?.map((m, i) => (
				<div
					style={{
						display: "flex",
					}}
					key={m._id}
				>
					<p>{""}</p>
				</div>
			))}
		</ScrollableFeed>
	);
};

export default ScrollableChats;
