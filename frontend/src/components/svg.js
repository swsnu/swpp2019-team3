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
                  viewBox="0 0 160 160"
                  height={this.props.height}
                  width={this.props.width}
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                      d="m347 1336c-152-64-222-174-222-346 1-191 76-299 385-557 80-67 170-146 200-177 36-37 62-56 79-56 16 0 51 27 115 88 50 49 141 130 202 180 158 129 256 237 302 330 36 75 37 79 37 192 0 103-3 121-26 171-34 72-96 134-168 168-49 23-69 26-156 26-90 0-105-3-155-28-30-16-77-48-105-71l-50-44-49 45c-81 73-136 96-241 100-78 3-98 0-148-21z"
                      transform="matrix(.1 0 0 -.1 0 160)"
                    />
                </svg>
            );
            break;
        case "heart-blank":
            result = (
                <svg
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 160 160"
                  height={this.props.height}
                  width={this.props.width}
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                      d="m428 1359c-207-28-339-221-299-436 29-157 105-257 359-472 97-82 199-172 227-200 67-70 83-68 165 16 36 36 126 117 201 179 183 152 276 252 325 351 39 77 39 79 39 193 0 103-3 121-26 171-52 110-157 184-282 199-111 13-214-23-302-105l-48-45-49 46c-55 51-153 100-213 106-22 2-66 1-97-3zm151-139c23-11 76-51 115-90 47-46 81-70 96-70s44 22 86 64c34 36 86 77 115 91 45 23 62 27 119 23 92-5 153-42 193-118 26-50 28-63 25-135-5-136-66-226-266-396-53-46-138-120-188-166l-91-82-39 41c-21 22-102 95-179 162-159 137-214 192-258 255-34 49-67 146-67 195 0 51 28 132 57 167 62 73 191 100 282 59z"
                      transform="matrix(.1 0 0 -.1 0 160)"
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
