"use client";

import { useEffect, useRef, useState } from "react";
import handleTInput from "../TerminalCommandHandler";

const Terminal = () => {
    const [output, setOutput] = useState<string[]>([]);
    const [cwd, setCWD] = useState("$~")
    const outputRef = useRef<HTMLDivElement>(null);
    var astronaut_id = localStorage.getItem("astronautId");

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const target = e.currentTarget;
            const input = target.value;
            const response = await handleTInput(input);
            setOutput([...output, response]);
            target.value = "";
            setTimeout(() => target.focus(), 0);
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
                    help, try 'help'.
                </li>
                {output.map((line, idx) => (
                    <li
                        key={idx}
                        className={
                            line.includes("[!]") ? "negative-color" : ""
                        }>
                        {line.split("\n").map((part, partIdx) => (
                            <li
                                className={
                                    line.includes("[!]") ? "negative-color" : ""
                                }
                                key={partIdx}>
                                {part}
                            </li>
                        ))}
                    </li>
                ))}
            </div>
            <div className="flex flex-row items-center w-full">
                <span>{cwd}</span>
                <input
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
