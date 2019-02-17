import fs from "fs";
import glob from "glob";
import readline from "readline";
import Input from "./Input";
import Processor from "./Processor";
import ValueSourceFactory from "./ValueSourceFactory";

async function run() {
    const taskOptions = Input.getTaskOptions();
    const valueSource = ValueSourceFactory.createValueSource(taskOptions.valueSource);
    const values = await valueSource.getValuesAsync();
    const processor = new Processor(values, taskOptions);

    // Get files to process
    for (const processFilePattern of taskOptions.processFiles) {
        glob(processFilePattern, (err, matches) => {
            if (err) {
                throw err;
            }
            // Process matched file
            for (const match of matches) {
                console.debug(`File ${match} matches processFiles`);
                processFile(match, processor);
            }
        });
    }
}

async function processFile(filename: string, processor: Processor) {
    try {
        const tempFileName = `${filename}.temp`
        const inputStream = fs.createReadStream(filename);
        const outputStream = fs.createWriteStream(tempFileName);

        const reader = readline.createInterface({
            input: inputStream,
        });

        await new Promise((resolve) => {
            reader.on("line", (line) => {
                outputStream.write(`${processor.processLine(line)}\n`);
            }).on("close", () => {
                inputStream.close();
                outputStream.close();
                resolve();
            });
        });

        // Replace generated file
        fs.renameSync(tempFileName, filename);
        fs.unlinkSync(tempFileName);
    } catch {
        console.error(`Failed to process file. File path: ${filename}`);
    }
}

run()
    .then(() => {
        // Do nothing
    }, (reason) => {
        console.error(reason);
    });
