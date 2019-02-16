import Helper from "../Utils/Helper";
import LocalFileSource from "./LocalFileSource";

export enum ValueSourceType {
    LocalFile,
    RemoteFile,
    ADOVarGroup,
    AzureKeyVault,
}

export default class ValueSourceFactory {
    public createValueSource(type: ValueSourceType): IValueSource {
        switch (type) {
            case ValueSourceType.ADOVarGroup: {
                throw new Error("Not implemented yet");
            }
            case ValueSourceType.AzureKeyVault: {
                throw new Error("Not implemented yet");
            }
            case ValueSourceType.LocalFile: {
                const filename = Helper.getInput("filename");
                const delimiter = Helper.getInput("delimiter");
                const timeout = Helper.getInput<number>("timeout");

                if (!filename || filename === "") {
                    throw new Error(`Invalid local filename: ${filename}`);
                }

                return new LocalFileSource({ filename, delimiter, timeout });
            }
            case ValueSourceType.RemoteFile: {
                throw new Error("Not implemented yet");
            }
        }
    }
}
