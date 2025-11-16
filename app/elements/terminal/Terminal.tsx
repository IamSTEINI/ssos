"use client";

import { useEffect, useRef, useState } from "react";
import handleTInput from "../TerminalCommandHandler";

const Terminal = () => {
	const [output, setOutput] = useState<string[]>([]);
	const [history, setHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState<number | null>(null);
	const outputRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const astronaut_id = localStorage.getItem("astronautId");

	const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		const target = e.currentTarget;
		if (e.key === "Enter") {
			const input = target.value;
			if (input) setHistory((prev) => [...prev, input]);
			const response = await handleTInput(
				input,
				localStorage.getItem("cwd") || "home/" + astronaut_id
			);
			setOutput((prev) => [...prev, response ?? ""]);
			target.value = "";
			setHistoryIndex(null);
			setTimeout(() => target.focus(), 0);
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (history.length === 0) return;
			const idx =
				historyIndex === null
					? history.length - 1
					: Math.max(0, historyIndex - 1);
			target.value = history[idx];
			setHistoryIndex(idx);
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (history.length === 0 || historyIndex === null) return;
			const idx = historyIndex + 1;
			if (idx >= history.length) {
				target.value = "";
				setHistoryIndex(null);
			} else {
				target.value = history[idx];
				setHistoryIndex(idx);
			}
			return;
		}
	};

	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	}, [output]);

	return (
		<div
			ref={outputRef}
			className="w-full h-full min-w-[300px] resize-x overflow-auto flex flex-col relative border main-color">
			<h1 className="border-b main-color fixed w-full bg-black">
				SSOS - TERMINAL (#{astronaut_id})
			</h1>
			<div className="flex flex-col px-2">
				<li className="inverse-color">
					<br></br>[!] Welcome, astronaut. You&apos;re now logged in
					into the main server.
					<br />
					[!] Keep in mind, everyone has access to this! If you need
					help, try &apos;help&apos;.
				</li>
				{output.map((line, idx) => (
					<li
						key={idx}
						className={
							line.includes("[!]") ? "negative-color" : ""
						}>
						{line.split("\n").map((part, partIdx) => (
							<p
								className={
									line.includes("[!]") ? "negative-color" : ""
								}
								key={partIdx}>
								{part}
							</p>
						))}
					</li>
				))}
			</div>
			<div className="flex flex-row items-center w-full">
				<span>
					$
					{localStorage.getItem("cwd") === `home/${astronaut_id}`
						? "~"
						: localStorage.getItem("cwd") ?? ""}
				</span>
				<input
					ref={(el) => {
						inputRef.current = el;
					}}
					type="text"
					placeholder=">>>"
					className="border-none tracking-tighter h-1"
					autoFocus
					autoComplete="off"
					autoCorrect="off"
					spellCheck="false"
					onKeyDown={handleEnter}
				/>
			</div>
		</div>
	);
};

export default Terminal;
