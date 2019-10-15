import React from "react";
import "./App.css";

import { Route, Redirect, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import { Main } from "./containers";

function App(props) {
    return (
        <ConnectedRouter history={props.history}>
            <div className="App">
                <Switch>
                    <Route path="/main" exact component={Main} />
                    <Redirect exact from="/" to="/login" />
                </Switch>
            </div>
        </ConnectedRouter>
    );
}

export default App;
