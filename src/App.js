import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import {Container, Row, Col} from "react-bootstrap";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import NavigationBar from "./Components/NavigationBar";
import Autorization from "./Components/Autorization";
import Logout from "./Components/Logout";
import {connect, Provider} from "react-redux";
import store from "./redux/store/store";
import bindActionCreators from "redux/src/bindActionCreators";

function App(props) {
    return (
        <Provider store={store}>
            <div>
                {console.log("Otvet -> " + props.loggedIn)}
            </div>
            <Router>
                <NavigationBar loggedIn={props.loggedIn}/>
                <Container>
                    <Row>
                        <Col lg={12}>
                            <Switch>

                                <Route path="/logout" exact
                                       component={() => <Logout loggedIn={props.loggedIn}/>}/>

                                <Route path="/" exact
                                       component={() => <Autorization loggedIn={props.loggedIn}/>}/>


                                {/*<Route path="/" exact component={Autorization}/>*/}

                                {/*<Route path="/logout" exact component={Logout}/>*/}
                                {/*<Route path="/edit/:id" exact component={Teacher}/>*/}

                            </Switch>
                        </Col>
                    </Row>
                </Container>
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
