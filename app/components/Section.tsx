import React from "react";

interface SectionProps {
    children?: React.ReactNode;
    color?: string;
}

const Section: React.FC<SectionProps> = ({
    children,
    color = "main-color",
}) => {
    return <div className={`shear-section mb-13`}>{children}</div>;
};

export default Section;
