import React, { Component } from "react";

import { SideBar } from "../../components";
import Header from "../Header/Header";
import "./Main.css";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feeds: [],
        };
    }

    render() {
        return (
            <div>
                <Header />
                <SideBar className="sidebar" />
                <div className="feeds">
                    {this.state.feeds}
                    Main
                </div>
            </div>
        );
    }
}

export default Main;
