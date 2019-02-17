import fs from "fs";
import { Readable } from "stream";
import { ILocalFileSourceOptions } from "../Options";
import FileSource from "./FileSource";

/**
 * Load values from local file (Files in artifacts)
 *
 * @export
 * @class LocalFileSource
 * @implements {IValueSource}
 */
export default class LocalFileSource extends FileSource {
    private filename: string;

    constructor(options: ILocalFileSourceOptions) {
        super(options);
        this.filename = options.fileName;
    }

    protected async readFileAsync(): Promise<Readable> {
        return fs.createReadStream(this.filename);
    }
}
