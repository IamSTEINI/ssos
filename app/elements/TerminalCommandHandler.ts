"use client";
export default async function handleTInput(input: string, cwd: string) {
	input = input.toLocaleLowerCase();
	if (input == "?" || input == "help") {
		return help();
	} else if (input.startsWith("mkdir")) {
		const name = input.slice(5).trim();
		if (!name) {
			return "[!] Missing folder name. Usage: mkdir <name>";
		}
		const nameLower = name.toLowerCase();
		const invalidCharRe = /[^a-z0-9_.\/-]/g;
		if (invalidCharRe.test(nameLower)) {
			return "[!] Invalid folder name";
		}
		const response = await createFolder(nameLower);
		return response;
	} else if (input == "ls") {
		const response = await listFiles(cwd);
		return response;
	} else if (input.startsWith("touch")) {
		const rest = input.slice(5).trim();
		return await handleTouch(rest);
	} else if (input.startsWith("cat")) {
		const arg = input.slice(3).trim();
		return await handleCat(arg);
	} else if (input.startsWith("cd")) {
		const arg = input.slice(2).trim();
		return await changeDir(arg);
	} else {
		return "[!] Unknown Command. Try 'help'.";
	}
}

function help() {
	return `CMDS:
? / help        Show this help
ls              List files and folders
cd <dir>        Change directory (.. for parent, / for absolute)
mkdir <name>    Create a folder
touch <file> [content]  Create or overwrite a file
cat <file>      Show file contents`;
}
const getStored = () => {
	const astronautId = localStorage.getItem("astronautId");
	const home = `home/${astronautId}`;
	return localStorage.getItem("cwd") || home;
};

const sanitize = (p: string) => p.toLowerCase().replace(/[^a-z0-9_\.\/-]/g, "");

const resolvePath = (base: string, rel: string) => {
	const baseParts = base ? base.split("/").filter(Boolean) : [];
	const relParts = rel.split("/");
	for (const part of relParts) {
		if (!part || part == ".") continue;
		if (part == "..") baseParts.pop();
		else baseParts.push(part);
	}
	return baseParts.join("/");
};

async function changeDir(arg: string) {
	const home = getStored();
	if (!arg) {
		localStorage.setItem("cwd", home);
		return "";
	}

	let target = "";
	if (arg == "..") {
		const cur = getStored();
		const parts = cur.split("/").filter(Boolean);
		parts.pop();
		target = parts.join("/");
	} else if (arg.startsWith("/")) {
		target = sanitize(arg.replace(/^\/+/, ""));
	} else {
		const cur = getStored();
		target = resolvePath(cur, sanitize(arg));
	}

	const payload = {
		token: localStorage.getItem("astronaut_token"),
		path: target,
	};
	const resp = await fetch("/api/files/list", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const data = await resp.json();
	if (data.success == false) {
		if (data.error) return "[!] " + data.error;
		return "[!] Path does not exist";
	}

	localStorage.setItem("cwd", target);
	return "";
}

async function handleTouch(rest: string) {
	if (!rest)
		return "[!] Missing arguments. Usage: touch <filename> <content>";
	const firstSpace = rest.indexOf(" ");
	const name = firstSpace == -1 ? rest : rest.slice(0, firstSpace);
	const content = firstSpace == -1 ? "" : rest.slice(firstSpace + 1);
	let target = "";
	if (name.startsWith("/")) target = sanitize(name.replace(/^\/+/, ""));
	else target = resolvePath(getStored(), sanitize(name));
	return await createTouch(target, content);
}

async function handleCat(arg: string) {
	if (!arg) return "[!] Missing filename. Usage: cat <filename>";
	let target = "";
	if (arg.startsWith("/")) target = sanitize(arg.replace(/^\/+/, ""));
	else target = resolvePath(getStored(), sanitize(arg));
	const payload = {
		token: localStorage.getItem("astronaut_token"),
		path: target,
	};
	const resp = await fetch("/api/files/cat", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const data = await resp.json();
	if (data.success == false) {
		if (data.error) return "[!] " + data.error;
		return "[!] An unknown error occurred";
	}
	return data.content || "";
}

async function createFolder(namepath: string) {
	const payload = {
		token: localStorage.getItem("astronaut_token"),
		folderName: namepath,
	};
	const response = await fetch("/api/files/mkdir", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const data = await response.json();
	if (data.success == false) {
		if (data.error) {
			return "[!] " + data.error;
		} else {
			return "[!] An unknown error occurred";
		}
	} else {
		return "";
	}
}

async function createTouch(filepath: string, content: string) {
	const payload = {
		token: localStorage.getItem("astronaut_token"),
		filePath: filepath,
		content,
	};

	const response = await fetch("/api/files/touch", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const data = await response.json();

	if (data.success == false) {
		if (data.error) {
			return "[!] " + data.error;
		} else {
			return "[!] An unknown error occurred";
		}
	} else {
		return "";
	}
}

async function listFiles(cwd: string) {
	const path =
		cwd ||
		localStorage.getItem("cwd") ||
		`home/${localStorage.getItem("astronautId")}`;
	const payload = {
		token: localStorage.getItem("astronaut_token"),
		path,
	};
	const response = await fetch("/api/files/list", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const data = await response.json();
	if (data.success == false) {
		if (data.error) {
			return "[!] " + data.error;
		} else {
			return "[!] An unknown error occurred";
		}
	} else {
		const items = data.items || [];
		if (items.length == 0) return "";
		const lines = items.map((it: { path: string; isFolder?: boolean }) => {
			const name = it.path.split("/").pop() || it.path;
			return it.isFolder ? name + "/" : name;
		});
		return lines.join("\n");
	}
}
