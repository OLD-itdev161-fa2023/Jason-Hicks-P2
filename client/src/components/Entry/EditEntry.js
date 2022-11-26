import React, {useState} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles.css';

const EditEntry = ({ token, entry, onEntryUpdated }) => {
    let history = useHistory();
    const [entryData, setEntryData] = useState({
        temperature: entry.temperature,
        windspeed: entry.windspeed,
        rainfall: entry.rainfall
    });
    const { temperature, windspeed, rainfall } = entryData;

    const onChange = e => {
        const {name, value } = e.target;

        setEntryData({
            ...entryData,
            [name]: value
        });
    };

    const update = async () => {
        if (!temperature || !windspeed || !rainfall) {
            console.log('Title and windspeed are required');
        } else {
            const newEntry = {
                temperature: temperature,
                windspeed: windspeed,
                rainfall: rainfall
            };
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                const body = JSON.stringify(newEntry);
                const res = await axios.put(
                    `http://localhost:5000/api/entrys/${entry._id}`,
                    body,
                    config
                );

                onEntryUpdated(res.data);
                history.push('/');
            } catch (error){
                console.error(`Error creating entry: ${error.response.data}`);
            }
        }
    };

    return (
        <div className="form-contatainer">
            <h2>Edit Entry</h2>
            <input
                name="temperature"
                type="text"
                placeholder="Temperature"
                value={temperature}
                onChange={e => onChange(e)}
            />
            <input
                name="windspeed"
                type="text"
                placeholder="Windspeed"
                value={windspeed}
                onChange={e => onChange(e)}
            ></input>
            <input
                name="rainfall"
                type="text"
                placeholder="Rainfall"
                value={rainfall}
                onChange={e => onChange(e)}
            ></input>
            <button onClick={() => update()}>Submit</button>
        </div>
    );
};

export default EditEntry;