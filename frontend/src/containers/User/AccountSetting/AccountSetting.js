import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

import { userActions, authActions } from "../../../store/actions";
import { userStatus } from "../../../constants/constants";
import { PhotoCheckBox } from "../../../components/index";
import "./AccountSetting.css";

class AccountSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editUserStatus: userStatus.NONE,
            email: "",
            username: "",
            description: "",
            photoIndex: 0,
        };
    }

    componentDidMount() {
        if (this.props.me) {
            this.setState({
                email: this.props.me.email,
                username: this.props.me.username,
                description: this.props.me.description,
                photoIndex: this.props.me.photo_index,
            });
        }
    }

    /* eslint-disable react/no-did-update-set-state */
    // It's OK to use setState if it is wrapped in a condition
    // please refer to https://reactjs.org/docs/react-component.html#componentdidupdate
    componentDidUpdate(prevProps) {
        if (this.props.me !== prevProps.me) {
            this.setState({
                email: this.props.me.email,
                username: this.props.me.username,
                description: this.props.me.description,
                photoIndex: this.props.me.photo_index,
            });
        }
    }
    /* eslint-enable react/no-did-update-set-state */

    checkPhotoBoxHandler = () => {
        const radios = document.getElementsByName("photoCheckBox");
        let newPhotoIndex;
        for (newPhotoIndex = 0; newPhotoIndex < radios.length; newPhotoIndex += 1) {
            if (radios[newPhotoIndex].checked) { break; }
        }
        this.setState({
            photoIndex: newPhotoIndex,
        });
    }

    clickApplyHandler = () => {
        // if email is same with before, don't give it backend
        // otherwise, 420(EMAIL_ALREADY_EXISTS) will be raised
        let email = null;
        if (this.state.email !== this.props.me.email) {
            email = this.state.email;
        }
        // like the email, don't give the username if it is same as before
        let username = null;
        if (this.state.username !== this.props.me.username) {
            username = this.state.username;
        }

        const newUserInfo = {
            email,
            username,
            description: this.state.description,
            photo_index: this.state.photoIndex,
        };
        this.props.onEditMyInfo(newUserInfo)
            .then(() => {
                if (this.props.editUserStatus === userStatus.DUPLICATE_EMAIL) {
                    this.setState({ editUserStatus: userStatus.DUPLICATE_EMAIL });
                } else if (this.props.editUserStatus === userStatus.USERNAME_ALREADY_EXIST) {
                    this.setState({ editUserStatus: userStatus.USERNAME_ALREADY_EXIST });
                } else if (this.props.editUserStatus === userStatus.SUCCESS) {
                    this.setState({ editUserStatus: userStatus.SUCCESS });
                    this.props.onGetMe();
                }
            });
    }

    photoCheckMaker = (index) => (
        <PhotoCheckBox
          key={index}
          index={index}
          checked={this.state.photoIndex === index}
          checkHandler={() => this.checkPhotoBoxHandler()}
          size="100px"
        />
    )

    render() {
        let beforeEmail = null;
        let beforeUsername = null;
        let beforeDescription = null;
        let beforePhotoIndex = 0;
        let myProfileId = 0;
        if (this.props.me) {
            beforeEmail = this.props.me.email;
            beforeUsername = this.props.me.username;
            beforeDescription = this.props.me.description;
            beforePhotoIndex = this.props.me.photo_index;
            myProfileId = this.props.me.id;
        }

        let editUsernameMessage = "";
        if (this.state.editUserStatus === userStatus.USERNAME_ALREADY_EXIST) {
            editUsernameMessage = "This username already exists";
        }

        if (this.state.username === "") {
            editUsernameMessage = "Username cannot be null";
        }

        let editEmailMessage = "";
        if (this.state.editUserStatus === userStatus.DUPLICATE_EMAIL) {
            editEmailMessage = "This email already exists";
        } else if (this.state.email === "") {
            editEmailMessage = "Email cannot be null";
        }

        const indexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        const photoCheckList = indexList.reduce((arr, index) => {
            arr.push(this.photoCheckMaker(index));
            return arr;
        }, []);

        return (
            <div className="AccountSetting">
                <div className="AccountEditArea">
                    <h5 id="headerText">Account Setting</h5>
                </div>
                <div className="AccountEditArea" id="EditUserNameArea">
                    <h3 id="editUserNameTag">Edit Username</h3>
                    <input
                      id="editUserName"
                      type="text"
                      value={this.state.username}
                      onChange={(event) => this.setState({ username: event.target.value })}
                    />
                    <h3 className="editMessage" id="editUserNameMessage">{editUsernameMessage}</h3>
                </div>
                <div className="AccountEditArea" id="EditEmailArea">
                    <h3 id="editEmailTag">Edit Email</h3>
                    <h5 id="editEmailNotice">Note: Email is used to sign in, so be sure to remember it after the change.</h5>
                    <input
                      id="editEmail"
                      type="text"
                      value={this.state.email}
                      onChange={(event) => this.setState({ email: event.target.value })}
                    />
                    <h3 className="editMessage" id="editEmailMessage">{editEmailMessage}</h3>
                </div>
                <div className="AccountEditArea" id="EditDescArea">
                    <h3 id="editDescTag">Edit Description</h3>
                    <textarea
                      id="editDescription"
                      rows="4"
                      type="text"
                      placeholder="Write anything freely that describes yourself best."
                      value={this.state.description}
                      onChange={(event) => this.setState({ description: event.target.value })}
                    />
                </div>
                <div className="AccountEditArea" id="editPhotoArea">
                    <h3 id="editPhotoTag">Edit Profile Photo</h3>
                    <ul id="photoList">
                        {photoCheckList}
                    </ul>
                </div>
                <span className="AccountEditArea" id="ButtonArea">
                    <Button
                      className="AccountButtons"
                      id="applyButton"
                      onClick={this.clickApplyHandler}
                      disabled={(this.state.email === beforeEmail
                          && this.state.description === beforeDescription
                          && this.state.username === beforeUsername
                          && this.state.photoIndex === beforePhotoIndex
                      )
                          || this.state.email === ""
                          || this.state.username === ""}
                    >Apply
                    </Button>
                    <Button
                      className="AccountButtons"
                      id="gotoProfileButton"
                      href={`/profile_id=${myProfileId}`}
                    >
                        Go to Profile
                    </Button>
                </span>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    editUserStatus: state.user.status,
    me: state.auth.me,
});

const mapDispatchToProps = (dispatch) => ({
    onEditMyInfo: (newUserInfo) => dispatch(userActions.editUserInfo(newUserInfo)),
    onGetMe: () => dispatch(authActions.getMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSetting);

AccountSetting.propTypes = {
    editUserStatus: PropTypes.string,
    me: PropTypes.objectOf(PropTypes.any),
    onEditMyInfo: PropTypes.func,
    onGetMe: PropTypes.func,
};

AccountSetting.defaultProps = {
    editUserStatus: userStatus.NONE,
    me: null,
    onEditMyInfo: () => {},
    onGetMe: () => {},
};
