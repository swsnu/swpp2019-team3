import React from "react";
import Nav from "react-bootstrap/Nav";
import "./SideBar.css";

const SideBar = (props) => (
    <div className="sidebar">
        <Nav id="sidebar" defaultActiveKey="/main">
            <Nav.Link disabled={props.history.location.state != null && props.history.location.state.previous === "signup"} className="sidebar-link" id="main-link" href="/main">Main</Nav.Link>
            <Nav.Link disabled={props.history.location.state != null && props.history.location.state.previous === "signup"} className="sidebar-link" id="collection-link" href="/collections">Collection</Nav.Link>
            <Nav.Link disabled={props.history.location.state != null && props.history.location.state.previous === "signup"} className="sidebar-link" id="history-link" href="/history">History</Nav.Link>
        </Nav>
    </div>
);

export default SideBar;
