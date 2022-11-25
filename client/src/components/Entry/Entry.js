import React from "react";

const Entry = props => {
    const { entry } = props;

    return (
        <div>
            <h1>{entry.title}</h1>
            <p>{entry.body}</p>
        </div>
    )
}

export default Entry;