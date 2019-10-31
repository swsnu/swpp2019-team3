import React from "react";
import "./App.css";
import PropTypes from "prop-types";

import { Route, /* Redirect , */ Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";


import {
    Main, ReviewDetail, ReviewCreate, ReviewEdit, PaperDetail,
} from "./containers";

function App(props) {
    return (
        <ConnectedRouter history={props.history}>
            <div className="App">
                <Switch>
                    <Route path="/main" exact component={Main} />
                    <Route path="/papers/:paper_id/create" exact component={ReviewCreate} />
                    <Route path="/papers/:paper_id/:review_id" exact component={ReviewDetail} />
                    <Route path="/papers/:paper_id/:review_id/edit" exact component={ReviewEdit} />
                    <Route path="/papers/:id" exact component={PaperDetail} />
                </Switch>
            </div>
        </ConnectedRouter>
    );
}

App.propTypes = {
    history: PropTypes.instanceOf(Route).isRequired,
};

export default App;
