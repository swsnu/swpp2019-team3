import React from "react";
import {shallow} from "enzyme";
import { isMainThread } from "worker_threads";
import CollectionList from "./CollectionList";

describe("CollectionList test", () => {
    it("should render well", () =>{
        const component = shallow(<CollectionList/>);
        const wrapper = component.find(".CollectionList");
        expect(wrapper.length).toBe(1);
    });
});