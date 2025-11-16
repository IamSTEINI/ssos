import React from "react";
import NewsBar from "./components/NewsBar";
import prisma from "@/lib/prisma";
import AuthForm from "./components/AuthForm";
import Stars from "./components/Stars";
import { GitCommitIcon} from "lucide-react";

const WelcomePage = async () => {
    const user_amount = await prisma.user.count();

    return (
        <>
            <Stars />
            <div className="w-screen flex flex-col items-center">
                <NewsBar s={25}>
                    <p className="px-5">
                        [SUCCESS] Already {user_amount} registered astronauts
                    </p>
                    <p className="px-5">
                        [DISCOVERY] A strange SHIBA dog discovered on KP-52325
                    </p>
                    <p className="px-5">
                        [PROGRESS] Reusable waste test succeeds!
                    </p>
                    <p className="px-5">
                        [DEATH] Astronaut #32 was pronounced death
                    </p>
                </NewsBar>
                <h1 className="font-black italic text-[120px] mt-[350px]">
                    SSOS
                </h1>
                <span>SIEGE SPACE OS v3.2</span>
                <h2 className="font-thin text-xl positive-color mb-22">
                    {user_amount} astronauts registered.
                </h2>
                <div className="bg-black pb-10  z-10 w-full h-fit flex flex-col items-center">
                    <div className="seperator mb-10"></div>
                    <AuthForm />
                    <div className="seperate mt-3"></div>
                    <div className="px-10 mt-4">
                        <mark>You&apos;re an astronaut and so is everyone here.</mark>
                        <p>
                            This is SSOS, an operating system used on all
                            spaceships across the universe. This is our way to
                            communicate. This is the only way to communicate.
                        </p>
                        <p>
                            SSOS exists now for more than 67 years and is
                            constantly being improved and updated. We need to
                            maintain this network to ensure the safety of all
                            astronauts out there. <mark>SSOS counts on you.</mark>
                        </p>
                    </div>
                </div>
				<div className="flex flex-row items-center justify-center mt-16 w-full px-10 space-x-2">
					<GitCommitIcon />
					<a href="https://github.com/IamSTEINI/ssos">View source</a>
				</div>
            </div>
        </>
    );
};

export default WelcomePage;
