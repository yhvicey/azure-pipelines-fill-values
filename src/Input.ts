import tl from "azure-pipelines-task-lib";
import {
    IFileSourceOptions,
    ILocalFileSourceOptions,
    IRemoteFileSourceOptions,
    ITaskOptions,
    ValueSourceType,
} from "./Options";

export default class Input {
    public static getLocalFileSourceOptions(): ILocalFileSourceOptions {
        const fileOptions = this.getFileOptions();
        const fileName = tl.getInput("fileName");

        if (!fileName || fileName === "") {
            throw new Error(`Invalid local filename: ${fileName}`);
        }

        return {
            ...fileOptions,
            fileName,
        };
    }

    public static getRemoteFileSourceOptions(): IRemoteFileSourceOptions {
        const fileOptions = this.getFileOptions();
        const fileUrl = tl.getInput("fileUrl");

        if (!fileUrl || fileUrl === "") {
            throw new Error(`Invalid remote file url: ${fileUrl}`);
        }
        const fileUrlValue = new URL(fileUrl);

        return {
            ...fileOptions,
            fileUrl: fileUrlValue,
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

    private static getFileOptions(): IFileSourceOptions {
        const delimiter = tl.getInput("delimiter") || ",";
        const timeout = tl.getInput("timeout") || 10;
        const skipHeader = tl.getBoolInput("skipHeader") || false;

        const timeoutValue = Number(timeout);
        if (isNaN(timeoutValue)) {
            throw new Error("Invalid timeout value!");
        }

        return {
            delimiter,
            skipHeader,
            timeout: timeoutValue,
        };
    }
}
