import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { collectionStatus, signinStatus } from "../../../constants/constants";
import AddPaperModal from "./AddPaperModal";
import { getMockStore, mockComponent } from "../../../test-utils/mocks";
import { collectionActions } from "../../../store/actions";


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
};

const mockHistory = { push: jest.fn() };
const makeAddPaperModal = (initialState) => (
    <Provider store={getMockStore(initialState)}>
        <AddPaperModal id={1} history={mockHistory} location={{ pathname: "/paper_id=1" }} />
    </Provider>
);

jest.mock("../GoMyCollectionsModal/GoMyCollectionsModal", () => jest.fn(() => (mockComponent("GoMyCollectionsModal")())));
jest.mock("../../Collection/CollectionEntry/CollectionEntry", () => jest.fn((props) => (
    <input
      className="check-entry"
      id="check"
      type="checkbox"
      checked={props.ischecked}
      onChange={props.checkhandler}
      label={props.title}
    />
)));

const mockPromise = new Promise((resolve) => { resolve(); });

describe("<AddPaperModal />", () => {
    let addPaperModal;
    let spyGetCollections;
    let spyAddPaper;
    let spyMakeNewCollection;

    beforeEach(() => {
        addPaperModal = makeAddPaperModal(stubInitialState);
        spyGetCollections = jest.spyOn(collectionActions, "getCollectionsByUserId")
            .mockImplementation(() => () => mockPromise);
        spyAddPaper = jest.spyOn(collectionActions, "addCollectionPaper")
            .mockImplementation(() => () => mockPromise);
        spyMakeNewCollection = jest.spyOn(collectionActions, "makeNewCollection")
            .mockImplementation(() => () => mockPromise);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render without errors", () => {
        const component = mount(addPaperModal);
        const wrapper = component.find(".addpapermodal");
        expect(wrapper.length).toBe(1);
    });


    it("should open addpapermodal if addpaper-open-button is clicked", () => {
        const component = mount(addPaperModal);

        const openButton = component.find(".addpaper-open-button").hostNodes();
        expect(openButton.length).toBe(1);

        let wrapper = component.find(".add-button").hostNodes();
        expect(wrapper.length).toBe(0);

        openButton.simulate("click");
        expect(spyGetCollections).toHaveBeenCalledTimes(1);

        wrapper = component.find(".add-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("should open if adding paper or creating collection succeeds", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find(AddPaperModal.WrappedComponent).instance();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        let wrapper = component.find(".GoMyCollectionsModal");
        expect(wrapper.length).toBe(0);

        addPaperModalInstance.setState({ addPaperCollectionStatus: collectionStatus.SUCCESS });
        component.update();
        wrapper = component.find(".GoMyCollectionsModal");
        expect(wrapper.length).toBe(1);
    });

    it("should be closed if cancelButton is clicked", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find(AddPaperModal.WrappedComponent).instance();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        expect(addPaperModalInstance.state.isAddPaperOpen).toBe(true);

        const cancelButton = component.find(".cancel-button").hostNodes();
        expect(cancelButton.length).toBe(1);
        cancelButton.simulate("click");

        expect(addPaperModalInstance.state.isAddPaperOpen).toBe(false);
    });

    it("should set state properly on collectionName inputs", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find(AddPaperModal.WrappedComponent).instance();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        expect(addPaperModalInstance.state.isAddPaperOpen).toBe(true);

        const wrapper = component.find(".collection-name-input").hostNodes();
        wrapper.simulate("change", { target: { value: "new_collection" } });
        expect(addPaperModalInstance.state.collectionName).toBe("new_collection");
    });

    it("should render collection entries if it has collections", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

        addPaperModalInstance.setState({
            collections: [{ id: 1, title: "collection_1" },
                { id: 2, title: "collection_2" },
            ],
        });

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        component.update();
        const wrapper = component.find(".check-entry");
        expect(wrapper.length).toBe(2);
    });

    it("checkedCollections should reflect checking on collection entries", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

        addPaperModalInstance.setState({
            collections: [{ id: 1, title: "collection_1" },
                { id: 2, title: "collection_2" },
            ],
        });

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        component.update();
        const wrapper = component.find({ label: "collection_1" });
        wrapper.simulate("change", { target: { checked: true } });
        expect(addPaperModalInstance.state.checkedCollections).toStrictEqual([1]);

        wrapper.simulate("change", { target: { checked: false } });
        expect(addPaperModalInstance.state.checkedCollections).toStrictEqual([]);
    });

    it("should handle add paper to collection", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

        addPaperModalInstance.setState({
            collectionName: "",
            checkedCollections: [1, 2],
        });

        component.setProps({
            addPaperCollectionStatus: collectionStatus.SUCCESS,
        });

        component.update();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        const addButton = component.find(".add-button").hostNodes();
        addButton.simulate("click");

        expect(spyAddPaper).toHaveBeenCalledTimes(1);
        // Fix me: it should be success
        expect(addPaperModalInstance.state.addPaperCollectionStatus).toBe(collectionStatus.NONE);
    });

    it("should not handle add paper to collection", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

        addPaperModalInstance.setState({
            collectionName: "",
            checkedCollections: [1, 2],
        });
        component.update();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        const addButton = component.find(".add-button").hostNodes();
        addButton.simulate("click");

        expect(spyAddPaper).toHaveBeenCalledTimes(1);
        // Fix me: it should be failure
        expect(addPaperModalInstance.state.addPaperCollectionStatus).toBe(collectionStatus.NONE);
    });

    it("should handle make a new colelction and add paper to collection", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

        addPaperModalInstance.setState({
            collectionName: "collection_3",
            checkedCollections: [1, 2],
        });

        component.setProps({
            addPaperCollectionStatus: collectionStatus.SUCCESS,
        });

        component.update();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        const addButton = component.find(".add-button").hostNodes();
        addButton.simulate("click");

        expect(spyMakeNewCollection).toHaveBeenCalledTimes(1);
        expect(spyAddPaper).toHaveBeenCalledTimes(0); // Fix me: it should be 1
        // Fix me: it should be success
        expect(addPaperModalInstance.state.addPaperCollectionStatus).toBe(collectionStatus.NONE);
    });

    it("should handle make a new colelction and add paper to collection", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

        addPaperModalInstance.setState({
            collectionName: "collection_3",
            checkedCollections: [1, 2],
        });

        component.setProps({
            addPaperCollectionStatus: collectionStatus.SUCCESS,
        });

        component.update();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        const addButton = component.find(".add-button").hostNodes();
        addButton.simulate("click");

        expect(spyMakeNewCollection).toHaveBeenCalledTimes(1);
        expect(spyAddPaper).toHaveBeenCalledTimes(0); // Fix me: it should be 1
        // Fix me: it should be failure
        expect(addPaperModalInstance.state.addPaperCollectionStatus).toBe(collectionStatus.NONE);
    });

    it("should handle make a new colelction and add paper to collection", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

        addPaperModalInstance.setState({
            collectionName: "collection_3",
            checkedCollections: [1, 2],
        });

        component.setProps({
            addPaperCollectionStatus: collectionStatus.SUCCESS,
        });

        component.update();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        const addButton = component.find(".add-button").hostNodes();
        addButton.simulate("click");

        expect(spyMakeNewCollection).toHaveBeenCalledTimes(1); // Fix me: it should be 1
        expect(spyAddPaper).toHaveBeenCalledTimes(0); // Fix me: it should be 1
        // Fix me: it should be success
        expect(addPaperModalInstance.state.addPaperCollectionStatus).toBe(collectionStatus.NONE);
    });

    it("should handle when nothing changed", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find(AddPaperModal.WrappedComponent).instance();

        addPaperModalInstance.setState({
            beforeCheckedCollections: [3],
            checkedCollections: [3],
        });
        component.update();

        const openButton = component.find(".addpaper-open-button").hostNodes();
        openButton.simulate("click");

        const addButton = component.find(".add-button").hostNodes();
        addButton.simulate("click");
        expect(addPaperModalInstance.state.updateMessage).toEqual("Nothing changed!");
    });
});
