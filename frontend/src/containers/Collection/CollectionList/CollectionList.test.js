import React from "react";
import {shallow} from "enzyme";
import CollectionList from "./CollectionList";

describe("CollectionList test", () => {
    it("should render well", () =>{
        const component = shallow(<CollectionList/>);
        let wrapper = component.find("#collectionCardsLeft");
        expect(wrapper.length).toBe(1);
        wrapper = component.find("#collectionCardsRight");
        expect(wrapper.length).toBe(1);
    });
});