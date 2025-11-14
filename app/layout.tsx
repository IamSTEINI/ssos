import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import "./res/scanlines.css";


export const metadata: Metadata = {
	title: "SSOS",
	description: "SIEGE SPACE OS",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased`}>
				{children}
			</body>
		</html>
	);
}
