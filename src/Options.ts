export enum ValueSourceType {
    LocalFile,
    RemoteFile,
    ADOVarGroup,
    AzureKeyVault,
}

export interface ITaskOptions {
    /**
     * Whether task should fail if token value is missing.
     *
     * @type {boolean}
     * @memberof ITaskOptions
     */
    failOnMissingValue: boolean;

    /**
     * RegExp pattern used to match tokens.
     *
     * @type {RegExp}
     * @memberof ITaskOptions
     */
    pattern: RegExp;

    /**
     * Pattern group index/name used to get token name.
     *
     * @type {(number | string)}
     * @memberof ITaskOptions
     */
    patternGroup: number | string;

    /**
     * Files to process.
     *
     * @type {string[]}
     * @memberof ITaskOptions
     */
    processFiles: string[];

    /**
     * Value source.
     *
     * @type {ValueSourceType}
     * @memberof ITaskOptions
     */
    valueSource: ValueSourceType;
}

/**
 * Common value source options.
 *
 * @export
 * @interface IValueSourceOptions
 */
export interface IValueSourceOptions {
    /**
     * Timeout for getValuesAsync operation in seconds.
     *
     * @type {number}
     * @memberof IValueSourceOptions
     */
    timeout: number;
}

export interface IFileSourceOptions extends IValueSourceOptions {
    /**
     * Delimiter used to split lines in the value file.
     *
     * @type {string}
     * @memberof ILocalFileSourceOptions
     */
    delimiter: string;

    /**
     * Skip file's header
     *
     * @type {boolean}
     * @memberof ITaskOptions
     */
    skipHeader: boolean;
}

export interface ILocalFileSourceOptions extends IFileSourceOptions {
    /**
     * Value file name.
     *
     * @type {string}
     * @memberof ILocalFileSourceOptions
     */
    fileName: string;
}

export interface IRemoteFileSourceOptions extends IFileSourceOptions {
    /**
     * Value file url.
     *
     * @type {URL}
     * @memberof IRemoteFileSourceOptions
     */
    fileUrl: URL;
}
