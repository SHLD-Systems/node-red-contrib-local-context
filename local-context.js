module.exports = function (RED) {

    function LocalContextNode(config) {

        RED.nodes.createNode(this, config);

        const node = this;

        node.on("input", function (msg, send, done) {

            try {

                /*
                 * Install the scratchpad() function if it isn't already present.
                 */
                if (typeof msg.scratchpad !== "function") {

                    msg.scratchpad = function scratchpad(num = null) {

                        if (!Array.isArray(this.refmap)) {
                            this.refmap = [];
                        }

                        if (num === 1) {
                            this.refmap[this.refmap.length - 1] = msg.local
                            this.refmap.push({});
                        }
                        else if (num === 2) {
                            this.refmap.pop();
                            msg.local = this.refmap.at(-1);
                        }
                        
                        msg.local = this.refmap.at(-1);
                        return msg.local;
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
                msg.scratchpad(1);

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
