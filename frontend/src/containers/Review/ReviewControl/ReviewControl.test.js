import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import ReviewControl from "./ReviewControl";
import { reviewActions, paperActions } from "../../../store/actions";
import { reviewStatus, getPaperStatus } from "../../../constants/constants";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";


const stubInitialState = {
    paper: {
        getPaperStatus: getPaperStatus.NONE,
        selectedPaper: {},
    },
    auth: {
    },
    collection: {

    },
    review: {
        make: {
            status: reviewStatus.NONE,
            review: {},
            error: null,
        },
        list: {
            status: reviewStatus.NONE,
            list: [],
            error: null,
        },
        edit: {
            status: reviewStatus.NONE,
            review: {},
            error: null,
        },
        delete: {
            status: reviewStatus.NONE,
            review: {},
            error: null,
        },
        selected: {
            status: reviewStatus.NONE,
            review: { id: 1 },
            error: null,
            replies: [],
        },
    },
};

describe("<ReviewControl />", () => {
    let reviewControl0;
    let reviewControl1;

    beforeEach(() => {
        reviewControl0 = (
            <Provider store={getMockStore(stubInitialState)}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route
                          path="/"
                          exact
                          render={() => (
                              <div>
                                  <ReviewControl
                                    mode={0}
                                    match={
                                        { params: { review_id: 1, paper_id: 1 } }
                                    }
                                  />
                              </div>
                          )}
                        />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        reviewControl1 = (
            <Provider store={getMockStore(stubInitialState)}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route
                          path="/"
                          exact
                          render={() => (
                              <div>
                                  <ReviewControl
                                    mode={1}
                                    match={
                                        { params: { review_id: 1, paper_id: 1 } }
                                    }
                                  />
                              </div>
                          )}
                        />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors 2", async () => {
        const spyOnGetPaper = jest.spyOn(paperActions, "getPaper")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        const spyOnGetReview = jest.spyOn(reviewActions, "getReview")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        const component = mount(reviewControl1);
        const wrapper = component.find(".review-control");
        expect(wrapper.length).toBe(1);
        expect(spyOnGetPaper).toBeCalledTimes(1);
        expect(spyOnGetReview).toBeCalledTimes(1);
    });

    it("should render without errors", () => {
        const component = mount(reviewControl0);
        const spyOnGetPaper1 = jest.spyOn(paperActions, "getPaper")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        const spyOnGetReview = jest.spyOn(reviewActions, "getReview")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        const wrapper = component.find(".review-control");

        expect(wrapper.length).toBe(1);
        expect(spyOnGetPaper1).toBeCalledTimes(2); // Fix me: it should be 1
        expect(spyOnGetReview).toBeCalledTimes(1); // Fix me: it should b 0
    });

    it("should handle click edit button", () => {
        const spyPush = jest.spyOn(history, "push");
        const spyOnSetReview = jest.spyOn(reviewActions, "setReviewContent")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        const component = mount(reviewControl1);
        const wrapper = component.find(".review-control");
        const button = wrapper.find(".edit-button").hostNodes();
        expect(button.length).toBe(1);
        button.simulate("click");

        expect(spyOnSetReview).toHaveBeenCalledTimes(1);
        expect(spyPush).toHaveBeenCalledTimes(1);
    });

    it("should handle click create button", () => {
        const spyMakeNewReview = jest.spyOn(reviewActions, "makeNewReview")
            .mockImplementation(() => () => new Promise(
                (resolve) => { resolve({ status: 200 }); },
            ));
        const component = mount(reviewControl0);
        const wrapper = component.find(".review-control");
        const button = wrapper.find(".create-button").hostNodes();
        expect(button.length).toBe(1);
        button.simulate("click");
        expect(spyMakeNewReview).toHaveBeenCalledTimes(1);
    });

    it("should handle change on title when create", () => {
        const event = {
            target: {
                name: "title",
                value: "ABC",
            },
        };
        const wrapper = mount(reviewControl0);
        const instance = wrapper.find("ReviewControl").instance();
        const input = wrapper.find(".title-input");
        expect(input.at(0).props().placeholder).toEqual("Enter title here.");
        input.hostNodes().simulate("change", event);
        wrapper.update();
        expect(instance.state.title).toBe("ABC");
    });

    it("should handle change on title when edit", () => {
        const event = {
            target: {
                name: "title",
                value: "ABC",
            },
        };
        const wrapper = mount(reviewControl0);
        const instance = wrapper.find("ReviewControl").instance();
        const input = wrapper.find(".title-input");
        expect(input.at(0).props().placeholder).toEqual(instance.state.title);
        input.hostNodes().simulate("change", event);
        wrapper.update();
        expect(instance.state.title).toBe("ABC");
    });

    it("should handle change on content when create", () => {
        const event = {
            target: {
                name: "content",
                value: "ABC",
            },
        };
        const wrapper = mount(reviewControl0);
        const instance = wrapper.find("ReviewControl").instance();
        const input = wrapper.find(".content-input");
        expect(input.at(0).props().placeholder).toEqual("Enter content here.");
        input.hostNodes().simulate("change", event);
        wrapper.update();
        expect(instance.state.content).toBe("ABC");
    });

    it("should handle change on content when edit", () => {
        const event = {
            target: {
                name: "content",
                value: "ABC",
            },
        };

        const wrapper = mount(reviewControl1);
        const instance = wrapper.find("ReviewControl").instance();
        const input = wrapper.find(".content-input");
        expect(input.at(0).props().placeholder).toEqual(instance.state.content);
        input.hostNodes().simulate("change", event);
        wrapper.update();
        expect(instance.state.content).toBe("ABC");
    });
});
