create table workspaces(
    file_name varchar(255) not null,
    workspace_nodes text not null, --data is stored in a long string to be parsed, containing essentially an array of nodes
                                   --in the format of (type, name, x, y)
                                   --ex: "("val", "x", 100, 50), ("func", "sin", 300, 20), (etc.)"
    workspace_lines text not null, --stored like so: "(startNode, endNode, i), (startNode, endNode, i), (etc.)"
                                   --where startNode and endNode are numbers corresponding to the index numbers of the array above
                                   --and i is the input of the node the line is pointing to
                                   --ex: "(0, 1, 0), (etc.)"
    user_id varchar(255) not null references users(user_id),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
-- the plan is to have the node and edge information taken from the arrays of nodes and edges
-- in mist.js and translated into the strings above. then, that data can be taken from the strings
-- and placed back into the addEdge, addOp and addVal functions (found in workspace/mist/mist.js) in order
-- to rebuild the workspace.

-- the nodes would have to be rebuilt first and then placed into an array for the edges to be added

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON workspaces
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();