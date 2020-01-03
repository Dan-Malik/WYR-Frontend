import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import {authService} from "../services/authService";

class LoginPage extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            formEmail: "",
            formPwd: ""
        }
    }
    
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    submitLoginFormButton(event){
        event.preventDefault();

        authService.login(this.state.formEmail, this.state.formPwd);

        this.props.history.push("/");
    
    }

    render() {

        if(localStorage.getItem('currentUser')){
            this.props.history.push("/");
        }


        return (
            <Row className="border rounded shadow-sm bg-white" mb={2}>

                <Col className="mt-4 text-center" md={12}>

                    <h4>Log In</h4>
                    <hr />

                </Col>

                <Col></Col>
                <Col className="p-4" md={6}>

                    <Form>
                        <Form.Group controlId="loginEmailField">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name ="formEmail" onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group controlId="loginPasswordField">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" name="formPwd" onChange={this.handleChange}/>
                        </Form.Group>
                        
                    <div className="text-center">

                    <Button variant="warning" type="submit" onClick={this.submitLoginFormButton.bind(this)}>

                            Log In
                        </Button>
                        </div>
                    </Form>


                </Col>

                <Col></Col>
            </Row>);
    }
}

export default LoginPage;