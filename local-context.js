module.exports = function (RED) {

    function LocalContextNode(config) {

        RED.nodes.createNode(this, config);

        const node = this;

        node.on("input", function (msg, send, done) {

            try {

                /*
                 * Install the local() function if it isn't already present.
                 */
                if (typeof msg.local !== "function") {

                    msg.local = function local(num = null) {

                        if (!Array.isArray(this.refmap)) {
                            this.refmap = [];
                        }

                        if (num === 1) {
                            this.refmap.push({});
                        }
                        else if (num === 2) {
                            return this.refmap.pop();
                        }

                        return this.refmap.at(-1);
                    };
                }

                /*
                 * Ensure the reference map exists.
                 */
                if (!Array.isArray(msg.refmap)) {
                    msg.refmap = [];
                }

                /*
                 * Create a new local context.
                 */
                msg.local(1);

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

    RED.nodes.registerType("local-context", LocalContextNode);
};
