import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo, faList, faEdit} from '@fortawesome/free-solid-svg-icons'

import {Card, Form, Button, Col} from "react-bootstrap";
import MyToast from "../MyToast";
import axios from 'axios';

import "../../Style/style.css"
import "../../Style/addUser.css"

export default class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = this.initialState;
        this.userChange = this.userChange.bind(this);
        this.submitUser = this.submitUser.bind(this);
        this.userChangeChecked = this.userChangeChecked.bind(this);
    }

    initialState = {
        id: '',
        login: '',
        passwordHash: '',
        name: '',
        isActive: false,
        typeMessage: "",
        textMessage: "",
        show: false
    };

    componentDidMount() {
        const userId = +this.props.match.params.id;
        if (userId) {
            this.findUserById(userId);
        }
    }

    findUserById = (userId) => {
        // console.log("userId ---> " + userId);
        axios.get('http://localhost:8080/user/' + userId)
            .then(response => {
                console.log(response.data[0]);
                if (response.data[0] != null) {
                    this.setState({
                        id: response.data[0].id,
                        login: response.data[0].login,
                        name: response.data[0].name,
                        isActive: response.data[0].isActive
                    });
                }
            }).catch((error) => {
            console.error("Error - " + error);
        });
    };

    resetUser = () => {
        this.setState(() => this.initialState);
    };

    submitUser = event => {
        event.preventDefault();

        const user = {
            login: this.state.login,
            passwordHash: this.state.passwordHash,
            name: this.state.name
        };

        axios.post("http://localhost:8080/createUser", user)
            .then(response => {
                if (response.data != null) {
                    this.messageMyToast("Пользователь успешно добавлен", "success")
                }
            }).catch((error) => {
            this.messageMyToast("Ошибка при добавлении", "error");
        });
        // this.setState(this.initialState);
    };

    updateUser = event => {
        event.preventDefault();

        const user = {
            id: this.state.id,
            login: this.state.login,
            passwordHash: this.state.passwordHash,
            name: this.state.name
        };

        axios.put("http://localhost:8080/putUser", user)
            .then(response => {
                if (response.data != null) {
                    this.messageMyToast("Пользователь успешно обновлен", "success")
                    setTimeout(() => this.userList(), 3000);
                }
            }).catch((error) => {
            this.messageMyToast("Ошибка при обновлении", "error");
        });
        // this.setState(this.initialState);
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

    userChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    userChangeChecked = event => {
        this.setState({
            [event.target.name]: event.target.checked
        });
    };

    userList = () => {
        return this.props.history.push("/users");
    };

    render() {

        return (
            <div className="page sizePage mx-auto">
                {this.state.show ?
                    <MyToast show={this.state.show} type={this.state.typeMessage}
                             message={this.state.textMessage}/>
                    :
                    null
                }

                <Card className="border border-dark bg-light text-dark sizePage">
                    <Card.Header><FontAwesomeIcon
                        icon={this.state.id ? faEdit : faPlusSquare}/> {this.state.id ? "Редактировать пользователя" : "Добавить пользователя"}
                    </Card.Header>
                    <Form onReset={this.resetUser} onSubmit={this.state.id ? this.updateUser : this.submitUser}>
                        <Card.Body>
                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridISBNNumber">
                                    <Form.Label>ФИО</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="name"
                                                  value={this.state.name}
                                                  onChange={this.userChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите ФИО"/>
                                </Form.Group>

                            </Form.Row>
                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridPrice">
                                    <Form.Label>Контактное лицо(email)</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="login"
                                                  value={this.state.login}
                                                  onChange={this.userChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите email"/>
                                </Form.Group>

                            </Form.Row>

                            <Form.Row>
                                {/*passwordHash*/}
                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control required
                                                  type="password"
                                                  name="passwordHash"
                                                  value={this.state.passwordHash}
                                                  onChange={this.userChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите пароль"/>
                                </Form.Group>

                            </Form.Row>

                            {this.state.id ?
                                <Form.Row>

                                    <Form.Group as={Col} controlId="formGridLanguage">
                                        <Form.Label>Заблокирован</Form.Label>
                                        <Form.Control type="checkbox"
                                                      name="isActive"
                                                      checked={this.state.isActive}
                                                      value={this.state.isActive}
                                                      onChange={this.userChangeChecked}
                                                      className={"bg-light text-primary mx-auto"}
                                                      placeholder="Введите "/>
                                    </Form.Group>

                                </Form.Row>

                                :

                                null
                            }

                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave}/> {this.state.id ? "Обновить" : "Сохранить"}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Сброс
                            </Button>{' '}
                            <Button size="sm" variant="info" type="button" onClick={this.userList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Список Клиентов
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        )
    }
}
