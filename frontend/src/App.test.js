import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import App from "./App";
import { getMockStore, mockComponent, history } from "./test-utils/mocks";


jest.mock("./components/PrivateRoute/PrivateRoute", () => jest.fn(() => (mockComponent("PrivateRoute")())));

const mockStore = getMockStore({
    auth: {},
    paper: {},
    collection: {},
    user: {},
});

describe("App", () => {
    let app;

    beforeEach(() => {
        app = (
            <Provider store={mockStore}>
                <App history={history} />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render", () => {
        const component = mount(app);
        expect(component.find(".App").length).toBe(1);
    });
});
