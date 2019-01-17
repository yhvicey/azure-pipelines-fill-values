import tmrm from "azure-pipelines-task-lib/mock-run";
import path from "path";

let taskPath = path.join(__dirname, "..", "out", "index.js");
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput("tokenPattern", "\\$([^$]+)\\$");
tmr.setInput("inputFile", "inputfile");
tmr.setInput("processFiles", "testfile");

tmr.run();