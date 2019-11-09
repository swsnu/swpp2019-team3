import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";

import App from "./App";
import { getMockStore, history } from "./test-utils/mocks";

const mockStore = getMockStore({ auth: {}, paper: {}, collection: {} });

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
