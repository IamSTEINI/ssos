"use client";

import { useState } from "react";
import Section from "./Section";

const AuthForm = () => {
    const [passwordHidden, setPasswordHidden] = useState(true);

    return (
        <Section color="inverse-color">
            <h1 className="inverse-color text-3xl font-bold">
                Welcome back,astronaut
            </h1>
            <p>You can register here to gain access to the SSOS</p>
            <div className="flex flex-row items-center w-full">
                <input
                    type={passwordHidden ? "password" : "text"}
                    placeholder="Choose a secure password"
                    className="w-full"
                />
                <button onClick={() => setPasswordHidden((prev) => !prev)}>
                    {passwordHidden ? "SHOW" : "HIDE"}
                </button>
            </div>
            <p className="inverse-color">
                Are you already an astronaut? Enter A-ID -&gt;
            </p>
            <input type="text" placeholder="A-ID" className="w-full" />
            <button className="w-full">Enter</button>
        </Section>
    );
};

export default AuthForm;