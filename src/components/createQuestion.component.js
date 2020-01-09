import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import axios from 'axios';
import { authService } from '../services/authService';

class CreateQuestion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            formOptionA: "",
            formOptionB: "",
            outputMsg: "",
            currentUser: null,
            redirectTarget: null
        }
    }

    componentDidMount() {
        authService.currentUser.subscribe(userData => this.setState({ currentUser: userData }))
    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }



    submitSignUpFormButton(event) {
        event.preventDefault();

        this.setState({ outputMsg: "" });

        if (!this.state.currentUser) {
            return this.setState({ outputMsg: "Not signed in!" });
        }

        if (this.state.formOptionA.length < 3 || this.state.formOptionB.length < 3) {

            return this.setState({ outputMsg: "Options are too short!" });

        }

        axios.post(`${process.env.REACT_APP_BACKEND_IP}/api/question/`, {
            optionA: this.state.formOptionA,
            optionB: this.state.formOptionB,
            createdBy: this.state.currentUser.data.new_user.id,
            createdByUsername: this.state.currentUser.data.new_user.username
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.state.currentUser.data.token
                }
            }
        ).then((response => {

            this.setState({ redirectTarget: response.data.questionId });

        })).catch((err) => {

            console.log(err);

            if(err.response.status===401){
                authService.logout();
            }

        });



    }

    componentDidUpdate() {

        if (this.state.redirectTarget) {
            this.props.history.push(`/question/id/${this.state.redirectTarget}`);
        }
    }

    render() {


        //If user is not logged in redirect away from create page
        if (!localStorage.getItem('currentUser')) {
            this.props.history.push("/");
        }



        return (
            <Row className="border rounded shadow-sm bg-white" mb={2}>


                <Col className="mt-4 text-center" md={12}>

                    <h4>Create a Question</h4>
                    <hr />

                </Col>

                <Col></Col>
                <Col className="p-4" md={6}>

                    {/* { typeof(this.state.outputMsg) == "object" ? this.state.outputMsg.map(msg => <h5>{msg}</h5>): this.state.outputMsg } */}

                    <Form>


                        <Form.Group controlId="signUpEmailField">
                            <Form.Label>Would you rather: </Form.Label>
                            <Form.Control type="text" placeholder="Enter first option" name='formOptionA' onChange={this.handleChange} />
                        </Form.Group>

                        <Form.Group controlId="signUpUsernameField">
                            <Form.Label>or:</Form.Label>
                            <Form.Control type="text" placeholder="Enter second option" name='formOptionB' onChange={this.handleChange} />
                        </Form.Group>


                        <div className="text-center">
                            <Button variant="warning" type="submit" onClick={this.submitSignUpFormButton.bind(this)}>Submit</Button>

                        </div>

                    </Form>


                </Col>

                <Col></Col>
            </Row>);
    }
}

export default CreateQuestion;