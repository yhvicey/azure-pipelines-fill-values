import assert from "assert";
import ttm from "azure-pipelines-task-lib/mock-test";
import path from "path";

describe("Sample task tests", () => {

    it("should succeed with simple inputs", function (done: MochaDone) {
        this.timeout(1000);

        const tp = path.join(__dirname, "..", "out", "tests", "index.success.test.js");
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, "should have succeeded");
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        done();
    });

    it("it should fail if tool returns 1", function (done: MochaDone) {
        this.timeout(1000);

        const tp = path.join(__dirname, "..", "out", "tests", "index.failure.test.js");
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, false, "should have failed");
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], "Bad input was given", "error issue output");

        done();
    });
});
