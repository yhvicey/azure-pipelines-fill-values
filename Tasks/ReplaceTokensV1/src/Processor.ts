import { env } from "process";
import { ITaskOptions } from "./Options";

export default class Processor {
    private failOnMissingValue: boolean;
    private pattern: RegExp;
    private patternGroup: number | string;
    private values: Map<string, string>;

    public constructor(values: Map<string, string>, options: ITaskOptions) {
        this.failOnMissingValue = options.failOnMissingValue;
        this.pattern = options.pattern;
        this.patternGroup = options.patternGroup;
        this.values = values;
    }

    public processLine(line: string): string {
        let tokenMatch = this.pattern.exec(line);

        while (tokenMatch) {
            console.info(`Replacing token ${tokenMatch[0]}`);
            const token = (typeof this.patternGroup === "number"
                ? tokenMatch[this.patternGroup]
                // TODO: Currently (2019-02) RegExp named capture groups are not supported by typescript,
                // use default group index instead.
                : tokenMatch[1]
            ) || tokenMatch[0] || "";
            const value = this.getValue(token) || "";
            line = line.replace(tokenMatch[0], value);

            tokenMatch = this.pattern.exec(line);
        }

        return line;
    }

    private getValue(token: string) {
        if (this.values.has(token)) {
            return this.values.get(token);
        }
        if (env[token]) {
            return env[token];
        }
        if (this.failOnMissingValue) {
            throw new Error(`Value of token ${token} not found.`);
        }
    }
}
