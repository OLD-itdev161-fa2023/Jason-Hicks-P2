import React, {useState} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles.css';

const CreateEntry = ({ token, onEntryCreated }) => {
    let history = useHistory();
    const [entryData, setEntryData] = useState({
        title: '',
        body: ''
    });
    const { title, body } = entryData;

    const onChange = e => {
        const {name, value } = e.target;

        setEntryData({
            ...entryData,
            [name]: value
        });
    };

    const create = async () => {
        if (!title || !body) {
            console.log('Title and body are required');
        } else {
            const newEntry = {
                title: title,
                body: body
            };
            
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                const body = JSON.stringify(newEntry);
                const res = await axios.entry(
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
            <h2>Create New Entry</h2>
            <input
                name="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => onChange(e)}
            />
            <textarea
                name="body"
                cols="30"
                rows="10"
                value={body}
                onChange={e => onChange(e)}
            ></textarea>
            <button onClick={() => create()}>Submit</button>
        </div>
    );
};

export default CreateEntry;