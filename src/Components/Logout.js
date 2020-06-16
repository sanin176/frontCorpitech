import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";

class Logout extends Component {
    componentDidMount() {
        localStorage.setItem('name',"");
        localStorage.setItem('loggedIn',false);
        this.props.dispatch({type: 'SET_LOGGED_IN', loggedIn: false});
    }
    render() {
        return (
            <div>
                <Redirect to="/"/>
            </div>
        )
    }
}

export default connect()(Logout)
