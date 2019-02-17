import Input from "./Input";
import { ValueSourceType } from "./Options";
import { IValueSource } from "./ValueSources/IValueSource";
import LocalFileSource from "./ValueSources/LocalFileSource";
import RemoteFileSource from "./ValueSources/RemoteFileSource";

export default class ValueSourceFactory {
    public static createValueSource(type: ValueSourceType): IValueSource {
        switch (type) {
            case ValueSourceType.ADOVarGroup: {
                throw new Error("Not implemented yet");
            }
            case ValueSourceType.AzureKeyVault: {
                throw new Error("Not implemented yet");
            }
            case ValueSourceType.LocalFile: {
                const options = Input.getLocalFileSourceOptions();

                return new LocalFileSource(options);
            }
            case ValueSourceType.RemoteFile: {
                const options = Input.getRemoteFileSourceOptions();

                return new RemoteFileSource(options);
            }
        }
    }
}
