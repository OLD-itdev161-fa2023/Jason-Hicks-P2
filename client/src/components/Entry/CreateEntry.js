import React, {useState} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles.css';

const CreateEntry = ({ token, onEntryCreated }) => {
    let history = useHistory();
    const [entryData, setEntryData] = useState({
        temperature: '',
        windspeed: '',
        rainfall: ''
    });
    const { temperature, windspeed, rainfall} = entryData;

    const onChange = e => {
        const {name, value } = e.target;

        setEntryData({
            ...entryData,
            [name]: value
        });
    };

    const create = async () => {
        if (!temperature || !windspeed || !rainfall) {
            console.log('temperature, windspeed and rainfall is necssary');
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
                const res = await axios.post(
                    'http://localhost:5000/api/entrys',
                    body,
                    config
                );

                onEntryCreated(res.data);
                history.push('/');
            } catch (error) {
                console.error(`Error creating entry: ${error.response.data}`);
            }
        }
    };

    return (
        <div className='form-contatainer'>
            <h2 className='title'>Create New Entry</h2>
            <input
                name="temperature"
                type="text"
                placeholder="temperature"
                value={temperature}
                onChange={e => onChange(e)}
            />
            <input
                name="windspeed"
                type="text"
                placeholder="windspeed"
                value={windspeed}
                onChange={e => onChange(e)}
            ></input>
            <input
                name="rainfall"
                type="text"
                placeholder="rainfall"
                value={rainfall}
                onChange={e => onChange(e)}
            ></input>
            <button onClick={() => create()}>Submit</button>
        </div>
    );
};

export default CreateEntry;