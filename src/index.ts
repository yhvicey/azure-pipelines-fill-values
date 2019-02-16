import tl from "azure-pipelines-task-lib";
import fs from "fs";
import glob from "glob";
import http from "http";
import path from "path";
import { env } from "process";

// ======================================================================
// Parameters:
//  tokenPattern:
//      Pattern of the tokens to replace, default is \$([^$]+)\$.
//      Note: If first regex group exists, it will be used to get value, otherwise the whole match will be used.
//  inputFile:
//      Path (or uri) to token-value file.
//  processFiles:
//      Files need to be processed. Wildcard is supported.
//  fileDelimiter:
//      Delimiter used to split file, default is ",".
//  skipHeader:
//      Skip input file"s header, default is false.
//  ignoreMissingValue:
//      Ignore missing token value, default is false.
// ======================================================================

async function run() {
    // 1. Get input parameters
    const tokenPattern = tl.getInput("tokenPattern", true);
    console.debug(`tokenPattern: ${tokenPattern}`);

    const inputFile = tl.getInput("inputFile") || "";
    console.debug(`inputFile: ${inputFile}`);

    const processFiles = tl.getInput("processFiles", true);
    console.debug(`processFiles: ${processFiles}`);

    const fileDelimiter = tl.getInput("fileDelimiter") || ",";
    console.debug(`fileDelimiter: ${fileDelimiter}`);

    const skipHeader = tl.getBoolInput("skipHeader") || false;
    console.debug(`skipHeader: ${skipHeader}`);

    const ignoreMissingValue = tl.getBoolInput("ignoreMissingValue") || false;
    console.debug(`ignoreMissingValue: ${ignoreMissingValue}`);

    // 2. Fetch input file if exist
    const inputFileContent = await fetchFile(inputFile);

    // 3. Parse tokens
    const tokenValues = parseTokens(inputFileContent, fileDelimiter, skipHeader);

    // 4. Process files
    await processAsync(tokenPattern, processFiles, tokenValues, ignoreMissingValue);
}

// Steps

async function fetchFile(tokenFile: string): Promise<string> {
    // If is local file
    if (fs.existsSync(tokenFile)) {
        console.info(`Found local file ${tokenFile}`);
        try {
            // Then try read the file content and return
            return await new Promise((resolve) => {
                resolve(fs.readFileSync(tokenFile).toString());
            });
        } catch { }
    }

    // If not, treat it as an "http(s)://" uri and try to get it
    console.info(`Trying to download file from ${tokenFile}`);
    return await new Promise<string>((resolve) => {
        try {
            const fileName = path.basename(tokenFile);
            const file = fs.createWriteStream(fileName);
            http.get(tokenFile, (res) => {
                res.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve(fs.readFileSync(fileName).toString());
                });
            });
        } catch {
            resolve("");
        }
    });
}

function parseTokens(inputFileContent: string, fileDelimiter: string = ",", skipHeader: boolean = false): Map<string, string> {
    // Normalize content and split to lines
    let lines = inputFileContent.replace("\r\n", "\n").replace("\r", "\n").split("\n");
    console.debug(`Got ${lines.length} lines.`);
    if (skipHeader && lines.length >= 1) {
        console.debug("Skipped first line due to skipHeader is true.");
        lines = lines.slice(1);
    }
    console.debug(`Using ${fileDelimiter} as delimiter.`);
    const map = new Map<string, string>();
    lines.forEach((line) => {
        if (line !== "") {
            const sections = line.split(fileDelimiter);
            if (sections.length >= 2) {
                map.set(sections[0], sections[1]);
            }
        }
    });
    return map;
}

async function processAsync(tokenPattern: string, processFiles: string, tokenValues: Map<string, string>, ignoreMissingValue: boolean = false) {
    await new Promise((resolve) => {
        // Find files to process
        glob(processFiles, (err, matches) => {
            if (err) {
                throw err;
            }
            const tokenRegex = new RegExp(tokenPattern);
            // Process each file
            matches.forEach((match) => {
                console.debug(`File ${match} matches processFiles`);
                // Read file content
                let content = fs.readFileSync(match).toString();
                let tokenMatch = tokenRegex.exec(content);
                while (tokenMatch) {
                    console.info(`Found token ${tokenMatch[0]}`);
                    const token = tokenMatch[1] || tokenMatch[0] || "";
                    const value = getTokenValue(token, tokenValues, ignoreMissingValue) || "";
                    content = content.replace(tokenMatch[0], value);

                    tokenMatch = tokenRegex.exec(content);
                }
                // Rename original file to "filename.orig"
                fs.renameSync(match, `${match}.orig`);
                // Write processed content to disk
                fs.writeFileSync(match, content);
            });
        });
        resolve();
    });
}

// Helpers

function getTokenValue(token: string, tokenValues: Map<string, string>, ignoreMissingValue: boolean = false) {
    if (tokenValues.has(token)) {
        return tokenValues.get(token);
    }
    if (env[token]) {
        return env[token];
    }
    if (!ignoreMissingValue) {
        throw new Error(`Value of token ${token} not found.`);
    }
}

run();
