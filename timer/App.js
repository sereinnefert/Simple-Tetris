import React from "react";
import {AsyncStorage} from "react-native";
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {autoRehydrate, persistStore} from "redux-persist";
import MainTabs from "./MainTap";
import {listReducer} from "./reducers";



const logger = createLogger({predicate: (getState, action) => __DEV__});


export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            store: null,
            isLoading: true,
        };
    }


    componentWillMount() {
        let reducer = combineReducers({
            ...listReducer,
        });


        let store = createStore(reducer, {}, compose(applyMiddleware(logger, thunk), autoRehydrate({log: true})));
        let persistor = persistStore(store, {
            storage: AsyncStorage,
        }, () => this.setState({isLoading: false}));


        this.setState({store, persistor});

    }

    render() {

        if (this.state.isLoading) {
            return null;
        }


        return (
            <Provider store={this.state.store} persistor={this.state.persistor}>
                <MainTabs />
            </Provider>
        );
    }
};

