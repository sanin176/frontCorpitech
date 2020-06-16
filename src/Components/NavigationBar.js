import React, {Component} from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import "../Style/styleNavigationBar.css"

class NavigationBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: ""
        }
    }


    componentDidMount() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
        this.props.dispatch({type: 'SET_LOGGED_IN', loggedIn: loggedInUser});
        this.setState({name: localStorage.getItem('userName')})
    }

    render() {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand>
                    <Link to={""} className="navbar-brand">
                        Corpitech
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>


                <Navbar.Collapse>
                    {
                        this.props.loggedIn &&
                        <Nav className="mr-auto">
                            <NavDropdown title="Клиенты" id="basic-nav-dropdown">
                                <NavDropdown.Item href="add">Клиенты</NavDropdown.Item>
                                <NavDropdown.Item href="add">Добавить Клиента</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown.Divider/>
                            <NavDropdown title="Пользователи" id="basic-nav-dropdown">
                                <NavDropdown.Item href="add">Пользхователи</NavDropdown.Item>
                                <NavDropdown.Item href="add">Добавить Пользователя</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    }
                    <Nav className="ml-auto" id="nameLogout">
                        {this.props.loggedIn ?
                            <NavDropdown title={this.state.name} id="basic-nav-dropdown" className="mr-sm-2">
                                <NavDropdown.Item href="logout">Выход</NavDropdown.Item>
                            </NavDropdown>
                            :
                            <Nav.Link href="/" className="mr-sm-2">
                                Вход
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>

            </Navbar>
        )
    }
}

export default connect()(NavigationBar)
