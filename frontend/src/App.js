import React from "react";
import "./App.css";
import PropTypes from "prop-types";

import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import {
    Intro, Main, SearchResult, ReviewDetail, PaperDetail, ReviewControl,
    ProfileDetail, AccountSetting, CollectionDetail, CollectionList,
} from "./containers";
import {
    PrivateRoute, Header, SideBar,
} from "./components";

function App(props) {
    return (
        <ConnectedRouter history={props.history} match={props.match}>
            <div className="App">
                <PrivateRoute history={props.history} />
                <Switch>
                    <Route path="/" exact component={Intro} />
                    <>
                        <Header history={props.history} />
                        <SideBar />
                        <Switch>
                            <Route path="/main" exact component={Main} />
                            <Route path="/search=:search_word" exact component={SearchResult} />
                            <Route
                              path="/paper_id=:paper_id/create"
                              exact
                              render={() => (
                                  <div>
                                      <ReviewControl
                                        mode={0}
                                        match={props.match}
                                        history={props.history}
                                      />
                                  </div>
                              )}
                            />
                            <Route path="/review_id=:review_id" exact component={ReviewDetail} />
                            <Route
                              path="/review_id=:review_id/edit"
                              exact
                              render={() => (
                                  <div>
                                      <ReviewControl
                                        mode={1}
                                        match={props.match}
                                        history={props.history}
                                      />
                                  </div>
                              )}
                            />
                            <Route path="/paper_id=:paper_id" exact component={PaperDetail} />
                            <Route path="/profile_id=:profile_id" exact component={ProfileDetail} />
                            <Route path="/account_setting" exact component={AccountSetting} />
                            <Route path="/collections" exact component={CollectionList} />
                            <Route path="/collection_id=:collection_id" exact component={CollectionDetail} />
                        </Switch>
                    </>
                </Switch>
            </div>
        </ConnectedRouter>
    );
}

App.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
};

App.defaultProps = {
    history: null,
    match: null,
};

export default App;
