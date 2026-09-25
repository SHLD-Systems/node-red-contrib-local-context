module.exports = function (RED) {

    function LocalContextNode(config) {

        RED.nodes.createNode(this, config);

        const node = this;

        node.on("input", function (msg, send, done) 
        {

            /*
            * Define the scratchpad() function.
            */
            function scratchpad(num = null) 
            {
                if (num === 1) 
                {
                    this.refmap.push(msg.local);
                    msg.local = {};
                }
                else if (num === 2) 
                {
                    if (this.refmap.length === 0) 
                    {
                        delete msg.local;
                        return null;
                    }
                    msg.local = this.refmap.pop();
                }
                return msg.local;
            };
            
            try 
            {

                /*
                 * Ensure the reference map exists.
                 */
                if (!Array.isArray(msg.refmap)) 
                {
                    msg.refmap = [];
                };

                /*
                 * Install the scratchpad() function if it isn't already present.
                 */
                if (typeof msg.scratchpad !== "function") 
                {
                    msg.scratchpad = scratchpad;
                };

                /*
                 * Create a new local context.
                 */
                msg.scratchpad(1);

                send(msg);

                if (done) 
                {
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
