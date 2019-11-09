import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { collectionStatus } from "../../../constants/constants";
import AddPaperModal from "./AddPaperModal";
import { getMockStore } from "../../../test-utils/mocks";
import { history } from "../../../store/store";
import { mockComponent } from "../../../test-utils/mocks";


const stubInitialState = {
    paper: {
    },
    auth: {},
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
};

const mockStore = getMockStore(stubInitialState);
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

describe("<AddPaperModal />", () => {
    let addPaperModal;

    beforeEach(() => {
        addPaperModal = makeAddPaperModal(stubInitialState);
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

        wrapper = component.find(".add-button").hostNodes();
        expect(wrapper.length).toBe(1);
    });

    it("should open if adding paper or creating collection succeeds", () => {
        const component = mount(addPaperModal);
        const addPaperModalInstance = component.find("AddPaperModal").instance();

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
        const addPaperModalInstance = component.find("AddPaperModal").instance();

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
        const addPaperModalInstance = component.find("AddPaperModal").instance();

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
});
