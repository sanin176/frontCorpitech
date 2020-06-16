import {createStore} from 'redux';
import rootReducer from "../reducers/reducer";
import {initialState} from "../reducers/reducer"
import applyMiddleware from "redux/src/applyMiddleware";
import thunk from "redux-thunk";

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
export default store;