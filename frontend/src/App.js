import React from "react";
import "./App.css";
import PropTypes from "prop-types";

import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import {
    Intro, Main, ReviewDetail, PaperDetail, ReviewControl, ProfileDetail, ProfileEdit,
    CollectionDetail, CollectionList,
} from "./containers";
import {
    Header, SideBar,
} from "./components";

function App(props) {
    return (
        <ConnectedRouter history={props.history}>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={Intro} />
                    <>
                        <Header />
                        <SideBar />
                        <Switch>
                            <Route path="/main" exact component={Main} />
                            <Route
                              path="/paper_id=:paper_id/create"
                              exact
                              render={() => (
                                  <div>
                                      <ReviewControl mode={0} history={props.history} />
                                  </div>
                              )}
                            />
                            <Route path="/review_id=:review_id" exact component={ReviewDetail} />
                            <Route
                              path="/review_id=:review_id/edit"
                              exact
                              render={() => (
                                  <div>
                                      <ReviewControl mode={1} history={props.history} />
                                  </div>
                              )}
                            />
                            <Route path="/paper_id=:paper_id" exact component={PaperDetail} />
                            <Route path="/profile/:id" exact component={ProfileDetail} />
                            <Route path="/profile/:id/edit" exact component={ProfileEdit} />
                            <Route path="/collections" exact component={CollectionList} />
                            <Route path="/collections/:collection_id" exact component={CollectionDetail} />
                        </Switch>
                    </>
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
