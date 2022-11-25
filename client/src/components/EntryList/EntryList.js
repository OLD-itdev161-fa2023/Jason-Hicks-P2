import React from "react";
import EntryListItem from "./EntryListItem";

const EntryList = props => {
    const { entrys, clickEntry, deleteEntry, editEntry } = props;
    return entrys.map(entry => (
        <EntryListItem
            key={entry._id}
            entry={entry}
            clickEntry={clickEntry}
            deleteEntry={deleteEntry}
            editEntry={editEntry}
        />
    ));
};

export default EntryList;