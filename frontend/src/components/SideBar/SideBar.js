import React from "react";
import Nav from "react-bootstrap/Nav";
import "./SideBar.css";

const SideBar = () => (
    <Nav className="sidebar" defaultActiveKey="/main">
        <Nav.Link className="main-link" href="/main">Main</Nav.Link>
        <Nav.Link className="collection-link" href="/collection">Collection</Nav.Link>
        <Nav.Link className="history-link" href="/history">History</Nav.Link>
    </Nav>
);

export default SideBar;
