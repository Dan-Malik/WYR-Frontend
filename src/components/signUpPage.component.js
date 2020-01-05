import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import axios from 'axios';

class SignUpPage extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            formEmail: "",
            formUsername: "",
            formPwd: "",
            outputMsg: ""
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }



    submitSignUpFormButton(event){
        event.preventDefault();

        this.setState({outputMsg: ""})

        let errors = [];

        if(this.state.formPwd.length < 8) {
            errors.push("Password must be above 8 characters.")
        }

        if(String(this.state.formEmail).search(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/) === -1){
            errors.push("Email address is invalid.")
        }

        if(!this.state.formUsername){
            errors.push("Please enter a username.")
        }

        if(errors.length === 0){


        axios.post(`${process.env.REACT_APP_BACKEND_IP}/api/users`,{
            email: this.state.formEmail,
            username: this.state.formUsername,
            password: this.state.formPwd
        }).then((response)=>{
            console.log(response);
            this.setState({outputMsg: "Something went wrong!"})
            this.props.history.push("/");

        }).catch((err)=>{
            console.log(err);
            this.setState({outputMsg: "Something went wrong!"})
        });
        
    } else{
        this.setState({outputMsg: errors});
    }
    
    }

    render() {


        //If user is already logged in redirect away from signup page
        if(localStorage.getItem('currentUser')){
            this.props.history.push("/");
        }


        return (
            <Row className="border rounded shadow-sm bg-white" mb={2}>


                <Col className="mt-4 text-center" md={12}>

                    <h4>Create an Account</h4>
                    <hr />

                </Col>

                <Col></Col>
                <Col className="p-4" md={6}>

        { typeof(this.state.outputMsg) == "object" ? this.state.outputMsg.map(msg => <h5>{msg}</h5>): this.state.outputMsg }

                    <Form>
                        <Form.Group controlId="signUpEmailField">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email address" name='formEmail' onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group controlId="signUpUsernameField">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" name='formUsername' onChange={this.handleChange}/>
                        </Form.Group>


                        <Form.Group controlId="signUpPasswordField">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" name='formPwd' onChange={this.handleChange}/>
                        </Form.Group>
                    <div className="text-center">
                    <Button variant="warning" type="submit" onClick={this.submitSignUpFormButton.bind(this)}>Sign Up</Button>

                        </div>

                    </Form>


                </Col>

                <Col></Col>
            </Row>);
    }
}

export default SignUpPage;