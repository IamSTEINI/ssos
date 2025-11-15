"use client";

import { useState } from "react";
import Section from "./Section";
import calculate_astronaut_abbreviation from "@/lib/calcs";

const AuthForm = () => {
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [newPasswordHidden, setNewPasswordHidden] = useState(true);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [aId, setAId] = useState("");

    const sendAccountReq = async () => {
        const payload =
            password.length > 0
                ? { input: password }
                : { input: aId + "+" + newPassword };

        const response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        const errorElement = document.getElementById("err");
        if (!data.success) {
            if (errorElement) {
                errorElement.textContent = data.error || "An error occurred";
            }
        } else {
            if (errorElement) {
                errorElement.textContent =
                    "Success! Welcome back A#" +
                    data.astronautId +
                    " " +
                    "(" +
                    calculate_astronaut_abbreviation(
                        data.astronautId
                    ).toString() +
                    ")";
            }
        }
    };

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => setPasswordHidden((prev) => !prev)}>
                    {passwordHidden ? "SHOW" : "HIDE"}
                </button>
            </div>
            <p className="inverse-color">
                Are you an astronaut? Enter A-ID & Password -&gt;
            </p>
            <div className="w-full flex flex-row items-center justify-center">
                <h1 className="text-2xl -translate-x-1">#</h1>
                <input
                    type="text"
                    placeholder="A-ID"
                    className="w-full"
                    value={aId}
                    onChange={(e) => setAId(e.target.value)}
                />
            </div>
            {aId.length > 0 && password.length == 0 && (
                <div className="flex flex-row items-center w-full">
                    <input
                        type={passwordHidden ? "password" : "text"}
                        placeholder="Enter your password"
                        className="w-full"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                        onClick={() => setNewPasswordHidden((prev) => !prev)}>
                        {newPasswordHidden ? "SHOW" : "HIDE"}
                    </button>
                </div>
            )}
            <p className="negative-color" id="err"></p>
            {(password.length <= 0 && aId.length <= 0) ||
            (password.length > 0 && aId.length > 0) ? (
                <>
                    <p className="negative-color">
                        Enter password to create a new account and A-ID to
                        login.
                    </p>
                    <button
                        onClick={sendAccountReq}
                        className="w-full opacity-50 pointer-events-none"
                        disabled>
                        LOGIN
                    </button>
                </>
            ) : (
                <button className="w-full" onClick={sendAccountReq}>
                    LOGIN
                </button>
            )}
        </Section>
    );
};

export default AuthForm;
