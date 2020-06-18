import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import {Col} from "react-bootstrap";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import NavigationBar from "./Components/NavigationBar";
import Autorization from "./Components/Autorization";
import Logout from "./Components/Logout";
import {connect, Provider} from "react-redux";
import store from "./redux/store/store";
import bindActionCreators from "redux/src/bindActionCreators";
import AddCustomer from "./Components/Clients/AddCustomer";
import ReadDeleteUpdateCustomers from "./Components/Clients/ReadDeleteUpdateCustomers";
import AddUser from "./Components/Users/AddUser";
import ReadDeleteUpdateUsers from "./Components/Users/ReadDeleteUpdateUsers";

function App(props) {
    return (
        <Provider store={store}>
            <Router>
                <NavigationBar loggedIn={props.loggedIn}/>
                <Col lg={12}>
                    <Switch>

                        <Route path="/logout" exact
                               component={() => <Logout loggedIn={props.loggedIn}/>}/>

                        <Route path="/" exact
                               component={() => <Autorization loggedIn={props.loggedIn}/>}/>


                        <Route path="/addCustomer" exact component={AddCustomer}/>
                        <Route path="/customers" exact component={ReadDeleteUpdateCustomers}/>
                        <Route path="/editCustomer/:id" exact component={AddCustomer}/>

                        <Route path="/addUser" exact component={AddUser}/>
                        <Route path="/users" exact component={ReadDeleteUpdateUsers}/>
                        <Route path="/editUser/:id" exact component={AddUser}/>

                    </Switch>
                </Col>
            </Router>
        </Provider>
    );
}

const putDispatchToProps = dispatch => bindActionCreators({}, dispatch);
const putStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn
    }
};
export default connect(putStateToProps, putDispatchToProps)(App);
