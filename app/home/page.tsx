import AuthCheck from "../components/AuthCheck";
import Terminal from "../elements/terminal/Terminal";

const HomePage = async () => {
    return (
        <AuthCheck>
            <div className="w-screen h-screen flex flex-row">
                <Terminal></Terminal>
            </div>
        </AuthCheck>
    );
};

export default HomePage;
