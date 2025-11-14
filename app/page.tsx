import React from "react";
import Section from "./components/Section.tsx";
import NewsBar from "./components/NewsBar.tsx";

const WelcomePage: React.FC = () => {
	return (
		<div className="w-screen flex flex-col items-center">
			<NewsBar>
				<p className="px-5">ABC</p>
				<p className="px-5">ABC</p>
				<p className="px-5">ABC</p>
				<p className="px-5">ABC</p>
			</NewsBar>
			<h1 className="font-black italic text-5xl">Welcome, Astronaut</h1>
			<Section color="inverse-color">
				<h1 className="inverse-color text-3xl font-bold">
					What&apos;s up
				</h1>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Quis, veniam.
				</p>
			</Section>
		</div>
	);
};

export default WelcomePage;
