import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import MyToast from "./MyToast";
import "../Style/style.css";
import "../Style/autorization.css";
import axios from 'axios';
import {connect} from "react-redux";

class Autorization extends Component {

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            typeMessage: "",
            textMessage: "",
            show: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    loginCheck = () => {
        const user = {
            login: this.state.login,
            passwordHash: this.state.password
        };

        console.log(user);

        axios.post('http://localhost:8080/checkLogin', user)
            .then(response => {
                if (response.data != null) {
                    console.log(response.data.name);
                    this.props.dispatch({type: 'SET_LOGGED_IN', loggedIn: true});
                    localStorage.setItem('userName', response.data.name);
                    localStorage.setItem('loggedIn', true);
                    // this.messageMyToast("Login successful", "success");
                } else {
                    this.messageMyToast("Данных в БД нет", "error");
                }
            }).catch((error) => {
            this.messageMyToast("Ошибка при входе", "error");
            console.error("Error here - " + error);
        });
    };

    handleSubmit = (e) => {
        const emailReg = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

        if (this.state.login.match(emailReg) !== null) {
            this.loginCheck();
        } else {
            this.messageMyToast("Ошибка при входе", "error");
        }
    };

    messageMyToast = (text, type) => {
        this.setState({
            show: true,
            textMessage: text,
            typeMessage: type
        });
        this.setState({show: true});
        setTimeout(() => this.setState({show: false}), 3000);
    };


    handleLogin(e) {
        this.setState({login: e.target.value});
    }

    handlePassword(e) {
        this.setState({password: e.target.value});
    }

    render() {

        return (
            this.props.loggedIn ?

                <div>
                    <Redirect to="/customers"/>
                </div>
                :
                <div className="jumbotron widthForm mx-auto page pageBasic">
                    {this.state.show ?
                        <MyToast show={this.state.show} type={this.state.typeMessage}
                                 message={this.state.textMessage}/>
                        :
                        null
                    }
                    <Form>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={this.state.login} onChange={this.handleLogin}
                                          placeholder="Введите email"/>
                            <Form.Text className="text-muted">
                                Мы никогда не передадим вашу электронную почту кому-либо еще.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" value={this.state.password} onChange={this.handlePassword}
                                          placeholder="Введите пароль"/>
                        </Form.Group>

                        <Button onClick={this.handleSubmit}>
                            Войти
                        </Button>
                    </Form>
                    <hr className="my-4"/>
                </div>
        );
    }
}

export default connect()(Autorization)
