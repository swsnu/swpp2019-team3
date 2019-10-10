import React from 'react';
import './App.css';

import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

function App(props) {
    return (
        <ConnectedRouter history ={props.history}>
            <div className="App" />
        </ConnectedRouter>
    );
}

export default App;
