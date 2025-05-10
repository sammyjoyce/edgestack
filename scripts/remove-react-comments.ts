import { Glob } from "bun";
import fs from "fs/promises";
import path from "path";

const commentsToRemove: string[] = [
	"// Import React and JSX type",
	"// Use JSX.Element",
	"// Import React",
	"// Import React and useRef",
	"// Added React import",
	"// Use React.ReactElement",
	"// Changed to JSX.Element",
	"// Changed to React.JSX.Element",
	"// Import React and Fragment",
	"// Import the new component",
	"// Import React and MouseEvent",
	"// Import React and useCallback",
	"// Import React and useEffect",
	"// Import React and useState",
	"// Import React, useEffect, useState, useCallback",
	"// Import React, type JSX, type ReactNode, useCallback, useEffect, useState",
	"// Import React, type JSX, useCallback, useEffect, useState",
];

const targetDirectory = "./app"; // Adjust if your app directory is different

async function removeComments() {
	const glob = new Glob("**/*.{ts,tsx}");
	let filesProcessed = 0;
	let filesChanged = 0;

	console.log(`Scanning for files in ${path.resolve(targetDirectory)}...`);

	for await (const file of glob.scan(targetDirectory)) {
		const filePath = path.join(targetDirectory, file);
		try {
			const content = await fs.readFile(filePath, "utf-8");
			const lines = content.split("\n");
			let changed = false;

			const newLines = lines.filter((line) => {
				const trimmedLine = line.trim();
				if (commentsToRemove.includes(trimmedLine)) {
					changed = true;
					return false; // Remove this line
				}
				return true; // Keep this line
			});

			if (changed) {
				const newContent = newLines.join("\n");
				await fs.writeFile(filePath, newContent, "utf-8");
				console.log(`Updated: ${filePath}`);
				filesChanged++;
			}
			filesProcessed++;
		} catch (error) {
			console.error(`Error processing file ${filePath}:`, error);
		}
	}

	console.log("\n--- Script Finished ---");
	console.log(`Total files scanned: ${filesProcessed}`);
	console.log(`Total files modified: ${filesChanged}`);
}

removeComments().catch(console.error);
