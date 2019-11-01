import React from "react";
import "./App.css";
import PropTypes from "prop-types";

import { Route, /* Redirect , */ Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";


import {
    Main, ReviewDetail, PaperDetail, ReviewControl,
} from "./containers";

function App(props) {
    return (
        <ConnectedRouter history={props.history}>
            <div className="App">
                <Switch>
                    <Route path="/main" exact component={Main} />
                    <Route
                      path="/papers/:paper_id/create"
                      exact
                      render={() => (
                          <div>
                              <ReviewControl mode={0} />
                          </div>
                      )}
                    />
                    <Route path="/papers/:paper_id/:review_id" exact component={ReviewDetail} />
                    <Route
                      path="/papers/:paper_id/:review_id/edit"
                      exact
                      render={() => (
                          <div>
                              <ReviewControl mode={1} />
                          </div>
                      )}
                    />
                    <Route path="/papers/:id" exact component={PaperDetail} />
                </Switch>
            </div>
        </ConnectedRouter>
    );
}

App.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

App.defaultProps = {
    history: null,
};

export default App;
