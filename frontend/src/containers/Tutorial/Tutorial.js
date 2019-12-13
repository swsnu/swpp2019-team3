import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Button, Carousel, Image,
} from "react-bootstrap";

import "./Tutorial.css";
import Slide1 from "./Slide1.png";
import Slide2 from "./Slide2.PNG";
import Slide3 from "./Slide3.PNG";
import Slide4 from "./Slide4.PNG";
import Slide5 from "./Slide5.PNG";
import Slide6 from "./Slide6.png";

class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.handleStart = this.handleStart.bind(this);
    }

    handleStart() {
        if (this.props.history.location.state != null && this.props.history.location.state.previous === "signup") {
            this.props.history.push({ pathname: "/init", state: { previous: "signup" } });
        } else {
            this.props.history.push("/main");
        }
    }

    render() {
        return (
            <div className="tutorial">
                <Carousel interval={null} wrap={false}>
                    <Carousel.Item>
                        <Image id="slide1" src={Slide1} fluid />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image id="slide2" src={Slide2} fluid />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image id="slide3" src={Slide3} fluid />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image id="slide4" src={Slide4} fluid />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image id="slide5" src={Slide5} fluid />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image id="slide6" src={Slide6} fluid />
                        <Carousel.Caption>
                            <Button className="nextButton" onClick={this.handleStart}>Start</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        );
    }
}

export default Tutorial;

Tutorial.propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
};

Tutorial.defaultProps = {
    history: null,
};
