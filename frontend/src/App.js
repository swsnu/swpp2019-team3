import React from "react";
import "./App.css";

//import { Route, Redirect, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

function App(props) {
    return (
        // eslint-disable-next-line react/prop-types
        <ConnectedRouter history = {props.history}>
            <div className="App">
            </div>
        </ConnectedRouter>
    );
}

export default App;



