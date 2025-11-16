export default async function handleTInput(input: String) {
    input = input.toLocaleLowerCase();
    if (input == "?" || input == "help") {
        return help()
    } else {
        return "[!] Unknown Command. Try 'help'.";
    }
}

function help() {
    return "ABC!\nABC"
}