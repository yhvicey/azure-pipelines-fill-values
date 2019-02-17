import readline from "readline";
import { Readable } from "stream";
import { IFileSourceOptions } from "../Options";
import { IValueSource } from "./IValueSource";

/**
 * Load values from local file (Files in artifacts)
 *
 * @export
 * @class LocalFileSource
 * @implements {IValueSource}
 */
export default abstract class FileSource implements IValueSource {
    private delimiter: string;
    private skipHeader: boolean;
    private timeout: number;

    constructor(options: IFileSourceOptions) {
        this.delimiter = options.delimiter;
        this.skipHeader = options.skipHeader;
        this.timeout = options.timeout;
    }

    public async getValuesAsync(): Promise<Map<string, string>> {
        // We should finish loading within the timeout
        const timeout = setTimeout(() => {
            throw new Error("Process file timeout!");
        }, this.timeout * 1000);

        const values = new Map<string, string>();

        try {
            const fileStream = await this.readFileAsync();
            const reader = readline.createInterface({
                input: fileStream,
            });

            await new Promise((resolve) => {
                reader.on("line", (line) => {

                    // Skip first line if skipHeader is true
                    if (this.skipHeader) {
                        this.skipHeader = false;
                        return;
                    }

                    const kvp = this.parseLine(line);
                    if (kvp) {
                        values.set(kvp[0], kvp[1]);
                    }
                }).on("close", () => {
                    reader.close();
                    resolve();
                });
            });
        } catch {
            console.error(`Failed to get values from file.`);
        }

        timeout.unref();
        return values;
    }

    protected abstract readFileAsync(): Promise<Readable>;

    /**
     * Parse a line to extract key and value.
     *
     * @private
     * @param {string} line Input line.
     * @returns {[string, string]} Extracted key-value pair.
     * @memberof LocalFileSource
     */
    private parseLine(line: string): [string, string] | undefined {
        const parts = line.split(this.delimiter);

        // If line contains less than two parts or key part is empty, then return undefined
        if (parts.length < 2 || parts[0] === "") {
            return undefined;
        }

        return [parts[0], parts[1]];
    }
}
