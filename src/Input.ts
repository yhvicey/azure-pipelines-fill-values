import tl from "azure-pipelines-task-lib";
import { ILocalFileSourceOptions, ITaskOptions, ValueSourceType } from "./Options";

export default class Input {
    public static getLocalFileSourceOptions(): ILocalFileSourceOptions {
        const valueFilename = tl.getInput("valueFilename");
        const delimiter = tl.getInput("delimiter") || ",";
        const timeout = tl.getInput("timeout") || 10;
        const skipHeader = tl.getBoolInput("skipHeader") || false;

        if (!valueFilename || valueFilename === "") {
            throw new Error(`Invalid local filename: ${valueFilename}`);
        }

        const timeoutValue = Number(timeout);
        if (isNaN(timeoutValue)) {
            throw new Error("Invalid timeout value!");
        }

        return {
            delimiter,
            fileName: valueFilename,
            skipHeader,
            timeout: timeoutValue,
        };
    }

    public static getTaskOptions(): ITaskOptions {
        const failOnMissingValue = tl.getBoolInput("failOnMissingValue") || false;
        const pattern = tl.getInput("pattern", true) || "\\$([^$]+)\\$";
        const patternGroup = tl.getInput("patternGroup") || 1;
        const processFiles = tl.getDelimitedInput("processFiles", ";") || [];
        const valueSource = tl.getInput("valueSource") || "";

        const patternValue = new RegExp(pattern);

        const valueSourceValue = ValueSourceType[valueSource as keyof typeof ValueSourceType];
        if (!valueSource || !(valueSourceValue in ValueSourceType)) {
            throw new Error(`Invalid value source: ${valueSourceValue}`);
        }

        return {
            failOnMissingValue,
            pattern: patternValue,
            patternGroup,
            processFiles,
            valueSource: valueSourceValue,
        };
    }
}
