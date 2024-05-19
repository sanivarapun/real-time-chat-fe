import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';
import './App.css'

const App = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        }
    }, []);

    return (
        <div>
            {token ? <Chat token={token} /> : <Auth setToken={setToken} />}
        </div>
    );
};

export default App;


