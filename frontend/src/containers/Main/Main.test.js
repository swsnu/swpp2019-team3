import React from "react";
import { shallow, mount } from "enzyme";
import Main from "./Main";

describe("<Main />", () => {
    it("should render without errors", () => {
        const component = shallow(<Main />);
        const wrapper = component.find(".main");
        expect(wrapper.length).toBe(1);
    });

    it("should make feedsLeft and feedsWrite well", () => {
        const component = mount(<Main />);
        component.setState(
            {
                feeds: [{
                    type: "Collection",
                    source: "liked",
                    id: 1,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }, {
                    type: "Paper",
                    source: "liked",
                    id: 2,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }, {
                    type: "Review",
                    source: "liked",
                    id: 3,
                    title: "dfad",
                    user: "Dfafdaf",
                    numPapers: 14,
                    numReplies: 15,
                }],
            },
        );
        expect(component.find("CollectionCard").length).toBe(1);
        expect(component.find("ReviewCard").length).toBe(1);
        expect(component.find("PaperCard").length).toBe(1);
    });
});
