import React from "react";

interface SectionProps {
	children?: React.ReactNode;
	color?: string;
}

const Section: React.FC<SectionProps> = ({
	children,
	color = "main-color",
}) => {
	return <div className={`border ${color} p-2 w-fit h-fit`}>{children}</div>;
};

export default Section;
