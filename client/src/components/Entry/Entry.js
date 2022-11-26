import React from "react";

const Entry = props => {
    const { entry } = props;

    return (
        <div>
            <h1>{entry.data}</h1>
            <p>{entry.temperature}</p>
            <p>{entry.windspeed}</p>
            <p>{entry.rainfall}</p>
        </div>
    )
}

export default Entry;