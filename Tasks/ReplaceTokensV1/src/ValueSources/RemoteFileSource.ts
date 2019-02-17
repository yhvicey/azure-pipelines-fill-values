import fs from "fs";
import http from "http";
import { Readable } from "stream";
import { Url } from "url";
import { IRemoteFileSourceOptions } from "../Options";
import FileSource from "./FileSource";

export default class RemoteFileSource extends FileSource {
    private fileUrl: URL;

    public constructor(options: IRemoteFileSourceOptions) {
        super(options);
        this.fileUrl = options.fileUrl;
    }

    protected async readFileAsync(): Promise<Readable> {
        return await new Promise<Readable>((resolve) => {
            http.get(this.fileUrl, (res) => {
                resolve(res);
            });
        });
    }
}
