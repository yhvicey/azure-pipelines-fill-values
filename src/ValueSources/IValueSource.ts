/**
 * Interface for describing value sources.
 *
 * @interface IValueSource
 */
interface IValueSource {
    /**
     * Gets value table from source.
     *
     * @returns {Promise<Map<string, string>>} Value table.
     * @memberof IValueSource
     */
    getValuesAsync(): Promise<Map<string, string>>;
}
