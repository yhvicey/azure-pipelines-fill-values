import path from 'path';
import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';

export default class Utils {
    public static getTaskPath() {
        let taskPath = path.join(__dirname, "..", "out", "index.js");
        return path.join(__dirname, "..", "out", "index.js")
    }

    public static getTaskMockRunner(): TaskMockRunner {
        return new TaskMockRunner(this.getTaskPath());
    }
}