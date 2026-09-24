module.exports = function (RED) {

    function EndLocalContextNode(config) {

        RED.nodes.createNode(this, config);

        const node = this;

        node.mode = config.mode || "pop";

        node.on("input", function (msg, send, done) {

            try {

                if (node.mode === "terminate") {

                    /*
                     * Completely terminate the local context system.
                     */
                    delete msg.local;
                    delete msg.refmap;

                }
                else {

                    /*
                     * Pop the most recent local context.
                     */
                    if (typeof msg.local === "function") {
                        msg.local(2);
                    }
                }

                send(msg);

                if (done) {
                    done();
                }

            }
            catch (err) {

                if (done) {
                    done(err);
                }
                else {
                    node.error(err, msg);
                }
            }
        });
    }

    RED.nodes.registerType(
        "end-local-context",
        EndLocalContextNode
    );
};
