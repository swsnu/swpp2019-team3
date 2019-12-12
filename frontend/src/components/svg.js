import React, { Component } from "react";
import PropTypes from "prop-types";

const svg = {
    heart: "M2 0c-.55 0-1.04.23-1.41.59-.36.36-.59.85-.59 1.41 0 .55.23 1.04.59 1.41l3.41 3.41 3.41-3.41c.36-.36.59-.85.59-1.41 0-.55-.23-1.04-.59-1.41-.36-.36-.85-.59-1.41-.59-.55 0-1.04.23-1.41.59-.36.36-.59.85-.59 1.41 0-.55-.23-1.04-.59-1.41-.36-.36-.85-.59-1.41-.59z",
    tag: "M0 0v2l3 3 1.5-1.5.5-.5-2-2-1-1h-2zm3.41 0l3 3-1.19 1.22.78.78 2-2-3-3h-1.59zm-1.91 1c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z",
    people: "M5.5 0c-.51 0-.95.35-1.22.88.45.54.72 1.28.72 2.13 0 .29-.03.55-.09.81.19.11.38.19.59.19.83 0 1.5-.9 1.5-2s-.67-2-1.5-2zm-3 1c-.83 0-1.5.9-1.5 2s.67 2 1.5 2 1.5-.9 1.5-2-.67-2-1.5-2zm4.75 3.16c-.43.51-1.02.82-1.69.84.27.38.44.84.44 1.34v.66h2v-1.66c0-.52-.31-.97-.75-1.19zm-6.5 1c-.44.22-.75.67-.75 1.19v1.66h5v-1.66c0-.52-.31-.97-.75-1.19-.45.53-1.06.84-1.75.84s-1.3-.32-1.75-.84z",
    zoom: "M3.5 0c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c.61 0 1.19-.16 1.69-.44a1 1 0 0 0 .09.13l1 1.03a1.02 1.02 0 1 0 1.44-1.44l-1.03-1a1 1 0 0 0-.13-.09c.27-.5.44-1.08.44-1.69 0-1.93-1.57-3.5-3.5-3.5zm0 1c1.39 0 2.5 1.11 2.5 2.5 0 .59-.2 1.14-.53 1.56-.01.01-.02.02-.03.03a1 1 0 0 0-.06.03 1 1 0 0 0-.25.28c-.44.37-1.01.59-1.63.59-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5zm-.5 1v1h-1v1h1v1h1v-1h1v-1h-1v-1h-1z",
    bell: "M4 0c-1.1 0-2 .9-2 2 0 1.04-.52 1.98-1.34 2.66-.41.34-.66.82-.66 1.34h8c0-.52-.24-1-.66-1.34-.82-.68-1.34-1.62-1.34-2.66 0-1.1-.89-2-2-2zm-1 7c0 .55.45 1 1 1s1-.45 1-1h-2z",
};

/* eslint-disable react/prefer-stateless-function */
class SVG extends Component {
    render() {
        let result = null;
        switch (this.props.name) {
        case "heart-fill":
            result = (
                <svg
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 30 30"
                  width={this.props.width}
                  height={this.props.height}
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                      d="m63 250c-12-5-27-18-33-30-20-37-2-77 58-130 31-27 58-50 61-50 4 0 32 24 64 54 54 49 58 56 55 91-2 28-11 44-31 59-27 20-29 20-57 4-26-15-33-15-57-3-32 17-31 17-60 5z"
                      transform="matrix(.1 0 0 -.1 0 30)"
                    />
                </svg>
            );
            break;
        case "heart-blank":
            result = (
                <svg
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                  width={this.props.width}
                  height={this.props.height}
                >
                    <path
                      d="m63 250c-12-5-27-18-33-30-20-37-2-77 58-130 31-27 58-50 61-50 4 0 32 24 64 54 54 49 58 56 55 91-2 28-11 44-31 59-27 20-29 20-57 4-26-15-33-15-57-3-32 17-31 17-60 5zm69-37c17-15 19-15 36 0 36 32 82 15 82-30 0-20-83-113-101-113-3 0-27 18-53 41-37 33-46 47-46 73 0 18 3 36 7 39 12 13 56 7 75-10z"
                      transform="matrix(.1 0 0 -.1 0 30)"
                    />
                </svg>
            );
            break;
        default:
            result = (
                <svg
                  x="0px"
                  y="0px"
                  width={this.props.width}
                  height={this.props.height}
                  viewBox="0 0 8 8"
                >
                    <path
                      fill={this.props.color}
                      d={svg[this.props.name]}
                    />
          &gt;
                </svg>
            );
        }
        return result;
    }
}

export default SVG;


SVG.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    color: PropTypes.string,
    name: PropTypes.string,
};

SVG.defaultProps = {
    width: "",
    height: "",
    color: "",
    name: "",
};
