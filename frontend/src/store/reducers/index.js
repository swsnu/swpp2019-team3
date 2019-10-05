import { combineReducers } from 'redux';
import { connectROUTER, connectRouter } from 'connected-react-router';

//import reducers here

const rootRouter = (history) => combineReducers({
    // put reducers here

    router: connectRouter(history)
});

export default rootReducer;