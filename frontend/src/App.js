import React from "react";
import "./App.css";
import PropTypes from "prop-types";

import { Route, Switch, Redirect } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
//
import {
    Intro, Main, SearchResult, ReviewDetail, PaperDetail, ReviewControl,
    ProfileDetail, AccountSetting, CollectionDetail, CollectionList,
    UserList, History, Init, Tutorial,
} from "./containers";
import {
    PrivateRoute, Header, SideBar,
} from "./components";
import CollectionManage from "./containers/Collection/CollectionManage/CollectionManage";

function App(props) {
    return (
        <div className="App">
            <ConnectedRouter history={props.history} match={props.match}>
                <PrivateRoute history={props.history} />
                <Switch>
                    <Route path="/" exact component={Intro} />
                    <>
                        <Header history={props.history} />
                        <div className="container">
                            <div className="row" id="content-row">
                                <div className="col-sm-2"><SideBar history={props.history} /></div>
                                <div className="col-sm-10">
                                    <Switch>
                                        <Route path="/main" history={props.history} exact component={Main} />
                                        <Route path="/init" exact component={Init} />
                                        <Route path="/tutorial" exact component={Tutorial} />
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
                                        <Route path="/history" exact component={History} />
                                        <Route path="/paper_id=:paper_id" exact component={PaperDetail} />
                                        <Route path="/profile_id=:profile_id" exact component={ProfileDetail} />
                                        <Route
                                          path="/profile_id=:id/followers"
                                          exact
                                          render={() => (
                                              <div>
                                                  <UserList
                                                    mode="followers"
                                                    match={props.match}
                                                    history={props.history}
                                                  />
                                              </div>
                                          )}
                                        />
                                        <Route
                                          path="/profile_id=:id/followings"
                                          exact
                                          render={() => (
                                              <div>
                                                  <UserList
                                                    mode="followings"
                                                    match={props.match}
                                                    history={props.history}
                                                  />
                                              </div>
                                          )}
                                        />
                                        <Route path="/account_setting" exact component={AccountSetting} />
                                        <Route path="/collections" exact component={CollectionList} />
                                        <Route path="/collection_id=:collection_id" exact component={CollectionDetail} />
                                        <Route
                                          path="/collection_id=:id/members"
                                          exact
                                          render={() => (
                                              <div>
                                                  <UserList
                                                    mode="members"
                                                    match={props.match}
                                                    history={props.history}
                                                  />
                                              </div>
                                          )}
                                        />
                                        <Route path="/collection_id=:collection_id/manage" exact component={CollectionManage} />
                                        <Redirect exact to="/main" />
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </>
                </Switch>
            </ConnectedRouter>
        </div>
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
