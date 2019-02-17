import mock from "azure-pipelines-task-lib/mock-run";
import path from "path";

let taskPath = path.join(__dirname, "..", "out", "index.js");
let tmr: mock.TaskMockRunner = new mock.TaskMockRunner(taskPath);

tmr.setInput("tokenPattern", "\\$([^$]+)\\$");
tmr.setInput("inputFile", "inputfile");
tmr.setInput("processFiles", "testfile");

tmr.run();