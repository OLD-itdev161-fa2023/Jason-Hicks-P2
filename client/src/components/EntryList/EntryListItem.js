import React from 'react';
import { useHistory } from 'react-router-dom';
import slugify from 'slugify'
import './styles.css';

const EntryListItem = props => {
    const { entry, clickEntry, deleteEntry, editEntry } = props;
    const history = useHistory();

    const handleClickEntry = entry => {
        const slug = slugify(entry.date, { lower: true});

        clickEntry(entry);
        history.push(`/entrys/${slug}`);
    };

    const handleEditEntry = entry => {
        editEntry(entry);
        history.push(`/edit-entry/${entry._id}`);
    };

    return(
        <div>
            <div className="entryListItem" onClick={() => handleClickEntry(entry)}>
                <h2>{entry.date}</h2>
                <p>{entry.temperature}</p>
                <p>{entry.windspeed}</p>
                <p>{entry.rainfall}</p>
            </div>
            <div className="entryControls">
                <button onClick={() => deleteEntry(entry)}>Delete</button>
                <button onClick={() => handleEditEntry(entry)}>Edit</button>
            </div>
        </div>
    );
};

export default EntryListItem;