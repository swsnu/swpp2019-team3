import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import { getMockStore } from "../../../test-utils/mocks";
import { collectionActions } from "../../../store/actions";
import CreateNewCollectionModal from "./CreateNewCollectionModal";
import { collectionStatus, signinStatus } from "../../../constants/constants";

const stubInitialState = {
    paper: {
    },
    auth: {
        signinStatus: signinStatus.SUCCESS,
        me: { id: 1 },
    },
    collection: {
        make: {
            status: collectionStatus.NONE,
            collection: {},
            error: null,
        },
        list: {
            status: collectionStatus.NONE,
            list: [],
            error: null,
        },
        edit: {
            status: collectionStatus.NONE,
            collection: {},
            error: null,
        },
        delete: {
            status: collectionStatus.NONE,
            collection: {},
            error: null,
        },
        selected: {
            status: collectionStatus.NONE,
            error: null,
            collection: {},
            papers: [],
            members: [],
            replies: [],
        },
    },
    user: {},
    review: {},
    reply: {},
};

const makeCreateNewCollectionModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <CreateNewCollectionModal />
    </Provider>
);

/* eslint-disable no-unused-vars */
const mockPromise = new Promise((resolve, reject) => { resolve(); });
/* eslint-enable no-unused-vars */

describe("CreateNewCollection test", () => {
    let createNewCollection;

    beforeEach(() => {
        createNewCollection = makeCreateNewCollectionModal(stubInitialState);
    });

    it("should render without errors", () => {
        const component = mount(createNewCollection);
        const wrapper = component.find(".CreateNewCollectionModal");
        expect(wrapper.length).toBe(1);
    });

    it("should set state to open/close modal", () => {
        const component = mount(createNewCollection);
        let wrapper = component.find("#modalOpenButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        const instance = component.find("CreateNewCollectionModal").instance();
        expect(instance.state.isModalOpen).toBe(true);
        wrapper = component.find("#cancelButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");
        expect(instance.state.isModalOpen).toBe(false);
    });

    it("should handle text inputs", () => {
        const component = mount(createNewCollection);
        let wrapper = component.find("#modalOpenButton").hostNodes();
        wrapper.simulate("click");
        wrapper = component.find("#newCollectionNameInput").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "asdf" } });
        wrapper = component.find("#newCollectionDescInput").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("change", { target: { value: "qwer" } });
        const instance = component.find(CreateNewCollectionModal.WrappedComponent).instance();
        expect(instance.state.newCollectionName).toBe("asdf");
        expect(instance.state.newCollectionDesc).toBe("qwer");
    });

    it("should handle making new collection", () => {
        // mocking actions
        /* eslint-disable no-unused-vars */
        const spyMakeNewCollection = jest.spyOn(collectionActions, "makeNewCollection")
            .mockImplementation(() => () => mockPromise);
        const spyGetCollectionsByUserId = jest.spyOn(collectionActions, "getCollectionsByUserId")
            .mockImplementation(() => () => mockPromise);
        /* eslint-enable no-unused-vars */

        // change state and click button
        const component = mount(createNewCollection);
        let wrapper = component.find("#modalOpenButton").hostNodes();
        wrapper.simulate("click");
        wrapper = component.find("#newCollectionNameInput").hostNodes();
        wrapper.simulate("change", { target: { value: "asdf" } });
        wrapper = component.find("#newCollectionDescInput").hostNodes();
        wrapper.simulate("change", { target: { value: "qwer" } });
        wrapper = component.find("#createButton").hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate("click");

        // expect actions to be called
        expect(spyMakeNewCollection).toHaveBeenCalledTimes(1);
        expect(spyGetCollectionsByUserId).toHaveBeenCalledTimes(1);
        const instance = component.find("CreateNewCollectionModal").instance();
        expect(instance.state.isModalOpen).toBe(false);
    });
});
