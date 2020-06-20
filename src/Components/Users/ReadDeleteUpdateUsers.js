import React, {Component} from "react";
import "../../Style/style.css"
import axios from "axios"
import {ButtonGroup, Button, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import ReactPaginate from 'react-paginate';
import MyToast from "../MyToast";

export default class ReadDeleteUpdateUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numberPage: 0,
            pageCount: 1,
            counter: 0,
            users: [],
            id: '',
            login: '',
            name: '',
            isActive: false,
            typeMessage: "",
            textMessage: "",
            show: false,
            filter: ""
        };

        this.handlePageClick = this.handlePageClick.bind(this);
        this.customerChange = this.customerChange.bind(this);
    }

    componentDidMount() {
        this.getAllUsers(this.state.numberPage, "");
        this.getNumberRecords("");
    }

    getNumberRecords = (textFilter) => {
        axios.get('http://localhost:8080/numberRecordsUsers/?filter=' + textFilter)
            .then(response => {
                if (response.data[0].numberRecordsUsers / 10 > 1)
                    this.setState({pageCount: response.data[0].numberRecordsUsers / 10});
            }).catch((error) => {
            this.messageMyToast("Ошибка при получении кол-во страниц", "error");
        });
    };

    getAllUsers = (number, textFilter) => {
        console.log('http://localhost:8080/users/' + number + '/?filter=' + textFilter);
        axios.get('http://localhost:8080/users/' + number + '/?filter=' + textFilter)
            .then(response => {
                this.setState({users: response.data});
            })
            .then(async () => {
                console.log(this.state.users);
                this.setState({
                    users: this.assembleUsers()
                })
            }).catch((error) => {
            this.messageMyToast("Ошибка при добавлении", "error")
        });
    };

    assembleUsers = () => {
        let users = this.state.users.map((user) => {
            return (
                {
                    action: <ButtonGroup>
                        <Link to={"editUser/" + user.id}
                              className="btn btn-sm btn-outline-primary"><FontAwesomeIcon icon={faEdit}/></Link>{' '}
                        <Button size="sm" variant="outline-danger"
                                onClick={this.deleteUser.bind(this, user.id)}><FontAwesomeIcon icon={faTrash}/></Button>
                    </ButtonGroup>,
                    amount: ++this.state.counter,
                    id: user.id,
                    login: user.login,
                    name: user.name,
                    isActive: String(user.isActive)
                }
            )

        });
        return users;
    };

    deleteUser = (userId) => {
        axios.delete('http://localhost:8080/deleteUser/' + userId)
            .then(response => {
                if (response.data != null) {
                    this.messageMyToast("Клиент удален успешно", "success");
                    this.getAllUsers(this.state.numberPage);
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
        this.getAllUsers(data.selected, this.state.filter);
    };

    customerChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.setState({numberPage: 0});
        this.getNumberRecords(event.target.value);
        this.getAllUsers(0, event.target.value);
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

                <div className="h1Text">Пользователи</div>

                {this.state.users.length !== 0 ?
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
                                <th>Логин</th>
                                <th>Имя</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {
                                this.state.users.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.action}</td>
                                        <td>{item.login}</td>
                                        <td>{item.name}</td>
                                        <td>{item.isActive}</td>
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
