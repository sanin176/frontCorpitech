import React, {Component} from "react";
import "../../Style/style.css"
import axios from "axios"
import {Card, ButtonGroup, Button, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';
import MyToast from "../MyToast";

export default class ReadDeleteUpdateCustomers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numberPage: 0,
            pageCount: 1,
            counter: 0,
            customers: [],
            id: '',
            organization: '',
            fio: '',
            email: '',
            dateTo: '',
            dateFrom: '',
            maxSeatCount: '',
            used: '',
            typeMessage: "",
            textMessage: "",
            show: false,
            filter: ""
        };

        this.handlePageClick = this.handlePageClick.bind(this);
        this.customerChange = this.customerChange.bind(this);
    }

    componentDidMount() {
        this.getAllCustomers(this.state.numberPage, "");
        this.getNumberRecords("");
    }

    getNumberRecords = (textFilter) => {
        axios.get('http://localhost:8080/numberRecordsCustomers/?filter=' + textFilter)
            .then(response => {
                if (response.data[0].numberRecordsCustomers / 10 > 1)
                    this.setState({pageCount: response.data[0].numberRecordsCustomers / 10});
            }).catch((error) => {
            this.messageMyToast("Ошибка при получении кол-во страниц", "error");
        });
    };

    getAllCustomers = (number, textFilter) => {
        axios.get('http://localhost:8080/customers/' + number + '/?filter=' + textFilter)
            .then(response => {
                this.setState({customers: response.data});
            })
            .then(async () => {
                console.log(this.state.customers);
                this.setState({
                    customers: this.assembleCustomers()
                })
            }).catch((error) => {
            this.messageMyToast("Ошибка при добавлении", "error")
        });
    };

    assembleCustomers = () => {
        let customers = this.state.customers.map((customer) => {
            return (
                {
                    action: <ButtonGroup>
                        <Link to={"editCustomer/" + customer.id}
                              className="btn btn-sm btn-outline-primary"><FontAwesomeIcon icon={faEdit}/></Link>{' '}
                        <Button size="sm" variant="outline-danger"
                                onClick={this.deleteCustomer.bind(this, customer.id)}><FontAwesomeIcon icon={faTrash}/></Button>
                    </ButtonGroup>,
                    amount: ++this.state.counter,
                    id: customer.id,
                    organization: customer.organization,
                    fio: customer.fio,
                    email: customer.email,
                    dateTo: customer.dateTo,
                    dateFrom: customer.dateFrom,
                    maxSeatCount: customer.maxSeatCount,
                    used: customer.used,
                }
            )

        });
        return customers;
    };

    deleteCustomer = (customerId) => {
        axios.delete('http://localhost:8080/deleteCustomer/' + customerId)
            .then(response => {
                if (response.data != null) {
                    this.messageMyToast("Клиент удален успешно", "success");
                    this.getAllCustomers(this.state.numberPage);
                }
            }).catch((error) => {
            this.messageMyToast("Ошибка удаления", "error")
        });
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

    handlePageClick = (data) => {
        this.setState({numberPage: data.selected});
        this.getAllCustomers(data.selected, this.state.filter);
    };

    customerChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.setState({numberPage: 0});
        this.getNumberRecords(event.target.value);
        this.getAllCustomers(0, event.target.value);
    };

    render() {
        return (
            <div className="page">

                <Form.Label>Фильтрация</Form.Label>
                <Form.Control required
                              type="test"
                              name="filter"
                              value={this.state.filter}
                              onChange={this.customerChange}
                              className={"bg-light text-primary filter"}
                              placeholder="Фильтрация"/>

                <div className="h1Text">Клиенты</div>

                {this.state.customers.length !== 0 ?
                    <div>

                        {this.state.show ?
                            <MyToast show={this.state.show} type={this.state.typeMessage}
                                     message={this.state.textMessage}/>
                            :
                            null
                        }

                        <table className="table">
                            <thead className="text-center">
                            <tr>
                                <th>Действия</th>
                                <th>Организация</th>
                                <th>Имя</th>
                                <th>email</th>
                                <th>Действует с</th>
                                <th>Действует по</th>
                                <th>Кол-во лицензий</th>
                                <th>Использовано</th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {
                                this.state.customers.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.action}</td>
                                        <td>{item.organization}</td>
                                        <td>{item.fio}</td>
                                        <td>{item.email}</td>
                                        <td>{item.dateFrom}</td>
                                        <td>{item.dateTo}</td>
                                        <td>{item.maxSeatCount}</td>
                                        <td>{item.used}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>

                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination justify-content-center"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}

                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'} ч
                        />

                    </div>

                    :

                    <div className="text-center">
                        Нет данных...
                    </div>
                }
            </div>
        )
    }
}
