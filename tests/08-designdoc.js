var setup = require('./setup'),
    assert = require('assert');

setup(function(err, cb) {
    assert(!err, "setup failure");

    cb.on("error", function (message) {
        console.log("ERROR: [" + message + "]");
        process.exit(1);
    });

    var ddoc = {
        "views": {
            "test-view": {
                "map": "function(doc,meta){emit(meta.id)}"
            }
        }
    };

    var docname = "dev_ddoc-test";

    // We don't know the state of the server so just
    // do an unconditional delete
    cb.deleteDesignDoc(docname, function() {
        // Ok, the design document should be done
        cb.setDesignDoc(docname, ddoc,
                        function(err, code, data) {
                            var util=require("util");
                            assert(!err, "error creating design document");
                            assert(code == 201, "Error creating design document");
                            cb.getDesignDoc(docname, function(err, code, data) {
                                assert(!err, "error getting design document");
                                assert(code == 200, "error getting design document");
                                cb.deleteDesignDoc(docname, function(err, code, data) {
                                    assert(!err, "Failed deleting design document");
                                    process.exit(0);
                                });
                            });
                        });
    });
})
