import React from "react";

interface NewsProps {
	children?: React.ReactNode;
	s?: number;
}

const NewsBar: React.FC<NewsProps> = ({ children, s = 12 }) => (
	<div className="newsbar">
		<div className="track" style={{ animationDuration: `${s}s` }}>
			{children}
		</div>
	</div>
);

export default NewsBar;
