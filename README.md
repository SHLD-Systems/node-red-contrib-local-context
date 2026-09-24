# node-red-contrib-local-context

 A lightweight Node-RED package for managing nested local scratchpads on messages.

 The package provides two nodes for creating and removing local context layers:

 - **Local Context** — creates a new local scratchpad layer.
- **End Local Context** — removes the current layer or completely terminates the local context system.

 The current scratchpad can be accessed from a Function node using `msg.local()`.

 ## Why local contexts?

 Local contexts provide a convenient way for a flow to maintain temporary, flow-specific data without adding numerous properties directly to `msg`.

 Each **Local Context** node creates a new scratchpad object. Nested local contexts can therefore be used when a flow needs temporary state with well-defined lifetimes.

 For example:

```
        Local Context
              │
              ▼
       ┌─────────────┐
       │  scratchpad │
       └─────────────┘
              │
              ▼
        Local Context
              │
              ▼
       ┌─────────────┐
       │  scratchpad │
       └─────────────┘
              │
              ▼
     End Local Context
       (Pop local context)
              │
              ▼
        End Local Context
       (Terminate all)
```

 The inner scratchpad exists only while the inner context is active. When it is popped, the previous context becomes active again.

 ## Nodes

 ### Local Context

 The **Local Context** node creates a new local scratchpad for the message.

 If the message does not already have a local context system, the node initializes one.

 Every time the node is executed, a new scratchpad layer is created.

 For example, after one **Local Context** node:

```
Local Context stack

┌───────────────┐
│ scratchpad 1  │  ← current
└───────────────┘
```

 After another **Local Context** node:

```
Local Context stack

┌───────────────┐
│ scratchpad 2  │  ← current
├───────────────┤
│ scratchpad 1  │
└───────────────┘
```

 The scratchpads are independent objects, allowing nested operations to maintain their own temporary state.

 ### End Local Context

 The **End Local Context** node provides two operations.

 #### Pop local context

 Removes the current scratchpad and returns to the previous local context.

 For example:

```
Before:

┌───────────────┐
│ scratchpad 2  │  ← current
├───────────────┤
│ scratchpad 1  │
└───────────────┘

After:

┌───────────────┐
│ scratchpad 1  │  ← current
└───────────────┘
```

 This is useful when a nested operation has completed but the outer local context is still required.

 #### Terminate all local context

 Completely removes the local context system from the message.

 This removes all local scratchpads and the associated local-context function.

 This mode is intended as the final cleanup operation when the message no longer needs any local context.

 ## Accessing the current scratchpad

 The nodes manage the lifetime of the local contexts. A Function node can access the currently active scratchpad using:

```
msg.local()
```

 For example:

```
const local = msg.local();

local.counter = 10;
local.name = "example";
```

 The next Function node can access the same scratchpad:

```
const local = msg.local();

node.warn(local.counter);
node.warn(local.name);
```

 The important distinction is that `msg.local()` is primarily an **access mechanism**. The **Local Context** and **End Local Context** nodes should be used to create and remove context layers.

 ## Nested scratchpads

 Local contexts can be nested to provide temporary state with different lifetimes.

 For example:

```
                 Local Context
                       │
                       ▼
             ┌─────────────────┐
             │ Outer scratchpad│
             └────────┬────────┘
                      │
                      ▼
                 Function
                msg.local()
                      │
                      ▼
                 Local Context
                       │
                       ▼
             ┌─────────────────┐
             │ Inner scratchpad│
             └────────┬────────┘
                      │
                      ▼
                 Function
                msg.local()
                      │
                      ▼
             End Local Context
              Pop local context
                      │
                      ▼
             Outer scratchpad
             becomes current
```

 For example, the outer Function node might store:

```
msg.local().value = "outer";
```

 After creating an inner context, another Function node can use:

```
msg.local().value = "inner";
```

 While the inner context is active, `msg.local()` refers to the inner scratchpad.

 After the **End Local Context → Pop local context** node executes, the outer scratchpad becomes current again.

 Therefore:

```
msg.local().value
```

 again refers to the `"outer"` value.

 ## Example flow

 A typical flow might look like:

```
┌───────────────┐
│ Local Context │
└───────┬───────┘
        │
        ▼
┌─────────────────┐
│ Function        │
│                 │
│ local =         │
│ msg.local()     │
│                 │
│ local.user = {} │
└───────┬─────────┘
        │
        ▼
┌───────────────┐
│ Local Context │
└───────┬───────┘
        │
        ▼
┌─────────────────┐
│ Function        │
│                 │
│ local =         │
│ msg.local()     │
│                 │
│ local.result=.. │
└───────┬─────────┘
        │
        ▼
┌────────────────────────┐
│ End Local Context      │
│ Pop local context      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ End Local Context      │
│ Terminate all context  │
└────────────────────────┘
```

 ## Context lifetime

 The local context is stored directly on the message.

 A typical lifecycle is:

```
Local Context
      │
      ▼
Create scratchpad
      │
      ▼
Use msg.local() from Function nodes
      │
      ▼
Local Context
      │
      ▼
Create nested scratchpad
      │
      ▼
Use nested scratchpad
      │
      ▼
End Local Context
(Pop)
      │
      ▼
Return to previous scratchpad
      │
      ▼
End Local Context
(Terminate)
      │
      ▼
Remove local context system
```

 This makes local contexts particularly useful for subflows or processing sections where temporary state needs to exist only for the duration of a particular operation.

 ## Installation

 ### Node-RED Palette Manager

 Once the package is available in the Node-RED Flow Library, it can be installed through:

 **Node-RED → Manage palette → Install**

 Search for:

 `node-red-contrib-local-context`

 ### npm

 The package can also be installed from the Node-RED user directory:

```
cd ~/.node-red
npm install node-red-contrib-local-context
```

 For a Docker-based Node-RED installation using `/data` as the user directory:

```
cd /data
npm install node-red-contrib-local-context
```

 Restart Node-RED after installation.


