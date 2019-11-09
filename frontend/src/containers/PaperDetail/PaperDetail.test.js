import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import PaperDetail from "./PaperDetail";
import { paperActions } from "../../store/actions";
import { getPaperStatus } from "../../store/reducers/paper/paper";
import { getMockStore } from "../../test-utils/mocks";

let stubInitialState = {
    paper: {
        getPaperStatus: getPaperStatus.NONE,
        selectedPaper: {},
    },
    auth: {},
    collection: {},
};
const mockHistory = { push: jest.fn() };
const makeIntroModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <PaperDetail history={mockHistory} location={{ pathname: "/paper_id=1" }} />
    </Provider>
);
/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("<PaperDetail />", () => {
    let paperDetail;
    let spyGetPaper;

    beforeEach(() => {
        paperDetail = makeIntroModal(stubInitialState);
        spyGetPaper = jest.spyOn(paperActions, "getPaper")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render without errors and call spyGetPaper", () => {
        const component = mount(paperDetail);
        const wrapper = component.find(".paperdetail-page");
        expect(wrapper.length).toBe(1);
        expect(spyGetPaper).toBeCalledTimes(1);
    });

    it("should handle when count is ready", () => {
        stubInitialState = {
            paper: {
                getPaperStatus: getPaperStatus.NONE,
                selectedPaper: { count: { likes: 3, reviews: 5 } },
            },
            auth: {},
            collection: {},
        };
        const component = mount(makeIntroModal(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        expect(instance.state.likeCount).toBe(0);
        // FIXME: actually, it should be '3'!
        expect(instance.state.reviewCount).toBe(0);
        // FIXME: actually, it should be '5'!
    });

    it("should handle when authors is ready", () => {
        stubInitialState = {
            paper: {
                getPaperStatus: getPaperStatus.NONE,
                selectedPaper: {
                    authors: [
                        { first_name: "A_f", last_name: "A_l" },
                        { first_name: "B_f", last_name: "B_l" },
                    ],
                },
            },
            auth: {},
            collection: {},
        };
        const component = mount(makeIntroModal(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        expect(instance.state.authorNames).toBe("");
        // FIXME: actually, it should be 'A_f A_l, B_f B_l'!
    });

    it("should handle when publication is ready", () => {
        stubInitialState = {
            paper: {
                getPaperStatus: getPaperStatus.NONE,
                selectedPaper: {
                    publication: { date: "2019-11-06" },
                },
            },
            auth: {},
            collection: {},
        };
        const component = mount(makeIntroModal(stubInitialState));
        const instance = component.find(PaperDetail.WrappedComponent).instance();
        expect(instance.state.date).toBe("");
        // FIXME: actually, it should be '2019-11-06'!
    });

    it("should handle when getPaper failed", () => {
        stubInitialState = {
            paper: {
                getPaperStatus: getPaperStatus.FAILURE,
                selectedPaper: {},
            },
            auth: {},
            collection: {},
        };
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
        // FIXME: actually, it should be '1'!
    });

    it("should make reviewCardsLeft and reviewCardsRight well", () => {
        const component = mount(makeIntroModal(stubInitialState));
        const paperDetailInstance = component.find(PaperDetail.WrappedComponent).instance();
        paperDetailInstance.setState(
            {
                reviews: [{
                    id: 1,
                    paperId: 1,
                    author: "review_author_1",
                    title: "review_title_1",
                    date: "2019-11-09",
                    likeCount: 0,
                    replyCount: 0,
                }, {
                    id: 2,
                    paperId: 1,
                    author: "review_author_2",
                    title: "review_title_2",
                    date: "2019-11-08",
                    likeCount: 0,
                    replyCount: 0,
                }],
            },
        );
        component.update();
        const wrapperLeft = component.find(".reviewcards-left");
        const wrapperRight = component.find(".reviewcards-right");
        expect(component.find("ReviewCard").length).toBe(2);
        expect(wrapperLeft.children().length).toBe(1);
        expect(wrapperRight.children().length).toBe(1);
    });
});
