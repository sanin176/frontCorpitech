import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo, faList, faEdit} from '@fortawesome/free-solid-svg-icons'

import {Card, Form, Button, Col} from "react-bootstrap";
import MyToast from "../MyToast";
import axios from 'axios';

import "../../Style/style.css"
import "../../Style/addCustomer.css"

export default class AddCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = this.initialState;
        this.customerChange = this.customerChange.bind(this);
        this.submitCustomer  = this.submitCustomer.bind(this);
        this.customerChangeChecked = this.customerChangeChecked.bind(this);
    }

    initialState = {
        id: '',
        licenseKey: '',
        fio: '',
        email: '',
        organization: '',
        isActive: false,
        dateFrom: '',
        dateTo: '',
        maxSeatCount: '',
        maxWorkstationCount: '',
        tmapiEmail: '',
        tmapiPassword: '',
        tmapiLimitKey: '',
        note: '',
        typeMessage: "",
        textMessage: "",
        show: false
    };

    componentDidMount() {
        const customerId = +this.props.match.params.id;
        if(customerId){
            this.findCustomerById(customerId);
        }
    }

    findCustomerById = (customerId) => {
        // console.log("customerId ---> " + customerId);
        axios.get('http://localhost:8080/customer/'+customerId)
            .then(response => {
                if(response.data != null){
                    console.log(response.data);
                    this.setState ({
                        id: response.data.id,
                        licenseKey: response.data.licenseKey,
                        fio: response.data.fio,
                        email: response.data.email,
                        organization: response.data.organization,
                        isActive: response.data.isActive,
                        dateFrom: response.data.dateFrom,
                        dateTo: response.data.dateTo,
                        maxSeatCount: response.data.maxSeatCount,
                        maxWorkstationCount: response.data.maxWorkstationCount,
                        tmapiEmail: response.data.tmapiEmail,
                        tmapiPassword: response.data.tmapiPassword,
                        tmapiLimitKey: response.data.tmapiLimitKey,
                        note: response.data.note
                    });
                }
            }).catch((error) => {
            console.error("Error - "+error);
        });
    };

    resetCustomer = () => {
        this.setState(() => this.initialState);
    };

    submitCustomer = event => {
        event.preventDefault();

        const customer = {
            licenseKey: this.state.licenseKey,
            fio: this.state.fio,
            email: this.state.email,
            organization: this.state.organization,
            isActive: this.state.isActive,
            dateFrom: this.state.dateFrom,
            dateTo: this.state.dateTo,
            maxSeatCount: this.state.maxSeatCount,
            maxWorkstationCount: this.state.maxWorkstationCount,
            tmapiEmail: this.state.tmapiEmail,
            tmapiPassword: this.state.tmapiPassword,
            tmapiLimitKey: this.state.tmapiLimitKey,
            note: this.state.note
        };

        axios.post("http://localhost:8080/createCustomer", customer)
            .then(response => {
                if (response.data != null) {
                    this.messageMyToast("Клиент успешно добавлен", "success")
                }
            }).catch((error) => {
            this.messageMyToast("Ошибка при добавлении", "error");
        });
        // this.setState(this.initialState);
    };

    updateCustomer = event => {
        event.preventDefault();

        const customer = {
            id: this.state.id,
            licenseKey: this.state.licenseKey,
            fio: this.state.fio,
            email: this.state.email,
            organization: this.state.organization,
            isActive: this.state.isActive,
            dateFrom: this.state.dateFrom,
            dateTo: this.state.dateTo,
            maxSeatCount: this.state.maxSeatCount,
            maxWorkstationCount: this.state.maxWorkstationCount,
            tmapiEmail: this.state.tmapiEmail,
            tmapiPassword: this.state.tmapiPassword,
            tmapiLimitKey: this.state.tmapiLimitKey,
            note: this.state.note
        };

        axios.put("http://localhost:8080/putCustomer", customer)
            .then(response => {
                if (response.data != null) {
                    this.messageMyToast("Клиент успешно обновлен", "success");
                    setTimeout(() => this.customerList(), 3000);
                }
            }).catch((error) => {
            this.messageMyToast("Ошибка при обновлении", "error");
        });
        this.setState(this.initialState);
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

    customerChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    customerChangeChecked = event => {
        this.setState({
            [event.target.name]: event.target.checked
        });
    };

    customerList = () => {
        return this.props.history.push("/customers");
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
                    <Card.Header><FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/> {this.state.id ? "Редактировать Клиента" : "Добавить Клиента"}</Card.Header>
                    <Form onReset={this.resetCustomer} onSubmit={this.state.id ? this.updateCustomer : this.submitCustomer}>
                        <Card.Body>
                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridISBNNumber">
                                    <Form.Label>№ лицензии</Form.Label>
                                    <Form.Control required
                                                  disabled={this.state.id ? true : false}
                                                  type="test"
                                                  name="licenseKey"
                                                  value={this.state.licenseKey}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите № лицензии"/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Контактное лицо</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="fio"
                                                  value={this.state.fio}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите ФИО"/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridPrice">
                                    <Form.Label>Контактное лицо(email)</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="email"
                                                  value={this.state.email}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите email"/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Организация</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="organization"
                                                  value={this.state.organization}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите имя организации"/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Заблокирован</Form.Label>
                                    <Form.Control type="checkbox"
                                                  name="isActive"
                                                  checked={this.state.isActive}
                                                  value={this.state.isActive}
                                                  onChange={this.customerChangeChecked}
                                                  className={"bg-light text-primary mx-auto"}
                                                  placeholder="Введите "/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Действует с</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="dateFrom"
                                                  value={this.state.dateFrom}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите число"/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Действует по</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="dateTo"
                                                  value={this.state.dateTo}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите число"/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Кол-во лицензий</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="maxSeatCount"
                                                  value={this.state.maxSeatCount}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите кол-во лицензий"/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Кол-во компьютеров</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="maxWorkstationCount"
                                                  value={this.state.maxWorkstationCount}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите кол-во компьютеров"/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>TMAPI E-mail</Form.Label>
                                    <Form.Control required
                                                  disabled={this.state.id ? true : false}
                                                  type="test"
                                                  name="tmapiEmail"
                                                  value={this.state.tmapiEmail}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите TMAPI E-mail"/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>TMAPI Password </Form.Label>
                                    <Form.Control required
                                                  disabled={this.state.id ? true : false}
                                                  type="test"
                                                  name="tmapiPassword"
                                                  value={this.state.tmapiPassword}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите TMAPI Password "/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>TMAPI ключ-ограничитель</Form.Label>
                                    <Form.Control required
                                                  disabled={this.state.id ? true : false}
                                                  type="test"
                                                  name="tmapiLimitKey"
                                                  value={this.state.tmapiLimitKey}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите TMAPI ключ-ограничитель"/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridLanguage">
                                    <Form.Label>Примечания</Form.Label>
                                    <Form.Control required
                                                  type="test"
                                                  name="note"
                                                  value={this.state.note}
                                                  onChange={this.customerChange}
                                                  className={"bg-light text-primary"}
                                                  placeholder="Введите Примечания"/>
                                </Form.Group>

                            </Form.Row>

                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave}/> {this.state.id ? "Обновить" : "Сохранить"}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Сброс
                            </Button>{' '}
                            <Button size="sm" variant="info" type="button" onClick={this.customerList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Список Клиентов
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        )
    }
}
