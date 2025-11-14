import React from "react";

interface NewsProps {
	children?: React.ReactNode;
}

const NewsBar: React.FC<NewsProps> = ({ children }) => {
	return (
		<marquee className="w-full h-fit border-b">
			<div className="flex flex-row">{children}</div>
		</marquee>
	);
};

export default NewsBar;
