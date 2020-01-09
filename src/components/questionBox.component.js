import React, { Component } from 'react';
import axios from 'axios';

import { Row, Col, Button } from 'react-bootstrap';

import CommentBox from './commentBox.component';

import { authService } from '../services/authService';

// If user has voted on the question, no voting buttons should appear and option that user voted for should be marked with text, plus some style change
// If user is not logged in, for now disable voting buttons
// If user is logged in and hasn't voted, vote buttons should appear on

//If user has not voted do not show other peoples votes


class QuestionBox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            questionData: null,
            currentUser: null,
            commentData: undefined
        }
    }

    componentDidMount() {

        authService.currentUser.subscribe(userData => this.setState({ currentUser: userData }))

        axios.get(`${process.env.REACT_APP_BACKEND_IP}/api/question/${this.props.match.params.id}`).then(
            (response) => {

                if (!response.data) {
                    //If question doesn't exist
                    console.log(response.data);
                    this.setState({ questionData: null });
                    this.props.history.push("/");

                } else {
                    console.log(response.data)
                    this.setState({questionData: response.data.questionData });
                    this.setState({commentData: response.data.comments});

                }
            }
        ).catch(
            (err) => {
                console.log(err);
                this.setState({ questionData: null });
                this.props.history.push("/");

            }
        );
    }

    render() {

        /////////////////////////
        //Before question loads//
        /////////////////////////

        if (!this.state.questionData) {
            return (
                <Row className="border rounded shadow-sm" mb={2}>

                    <Col className="mt-4 text-center" md={12}>

                        <h4>{this.state.questionData ? "Would you rather..." : ""}</h4>

                    </Col>

                </Row>
            );
        } else {

            ///////////////
            // Vote Data //
            ///////////////

            let votesForA = this.state.questionData.votesA.length;
            let votesForB = this.state.questionData.votesB.length;

            let aPercent = votesForA / (votesForA + votesForB);
            let bPercent = votesForB / (votesForA + votesForB);

            ///////////////

            let commentsArray = this.state.commentData;

            ////////////////////
            //If not logged in//
            ////////////////////

            if (!this.state.currentUser) {
                const notLoggedInQBox = <> <Col className="p-4" md={5}>

                    <Row className="no-gutters border rounded overflow-hidden flex-md-row position-relative">
                        <Col className="p-2 d-flex flex-column position-static justify-content-center bg-light">

                            <h3 className="mb-0 text-center">{this.state.questionData.optionA}?</h3>
                            <hr />
                            <small className="mb-0 text-center">{votesForA ? "Votes: " + votesForA + ", " + (aPercent * 100).toFixed(2) + "%" : "No votes yet!"}</small>

                        </Col>
                    </Row>
                </Col>


                    <Col className="p-4" md={2}>


                        <Row className="no-gutters flex-md-row position-relative">
                            <Col className="p-2 d-flex flex-column position-static justify-content-center ">

                                <h3 className="mb-0 text-center">OR</h3>
                                <small className="mb-0 text-center">{votesForA ? (votesForB ? votesForA + votesForB + " total votes!" : "No votes yet!") : "No votes yet!"}</small>

                            </Col>
                        </Row>

                    </Col>


                    <Col className="p-4" md={5}>


                        <Row className="no-gutters border rounded overflow-hidden flex-md-row position-relative">

                            <Col className="p-2 d-flex flex-column position-static justify-content-center bg-light">

                                <h3 className="mb-0 text-center">{this.state.questionData.optionB}?</h3>
                                <hr />
                                <small className="mb-0 text-center">{votesForB ? "Votes: " + votesForB + ", " + (bPercent * 100).toFixed(2) + "%" : "No votes yet!"}</small>

                            </Col>

                        </Row>

                    </Col>


                    <Col className="p-4" md={6}>

                    {commentsArray? <CommentBox comments={commentsArray} questionId={this.props.match.params.id}/>:""}

                    </Col>

                    <Col className="p-4" md={6}>


                    </Col>
                </>;

                return (<Row className="border rounded shadow-sm bg-white" mb={2}>

                    <Col className="mt-4 text-center" md={12}>

                        <h4>{this.state.questionData ? "Would you rather..." : "Something went wrong!"}</h4>

                    </Col>

                    {notLoggedInQBox}

                </Row>);
            }

            /////////////////////////
            //If user is logged in //
            /////////////////////////

            let handleVoteA = (event) => {
                event.preventDefault();

                if (!this.state.questionData.votesA.includes(this.state.currentUser.data.new_user.id)) {

                    axios.post(`${process.env.REACT_APP_BACKEND_IP}/api/question/${this.state.questionData._id}/vote`, {
                        userId: this.state.currentUser.data.new_user.id,
                        voteA: true,
                        unvote: false
                    }
                    ,{
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': this.state.currentUser.data.token
                        }
                    }
                    ).then((response) => {
                        console.log(response);
                        this.setState({questionData : response.data})
                    }).catch((err) => {

                        if(err.response.status===401){
                            authService.logout();
                        }

                    });

                }

            }

            let handleVoteB = (event) => {
                event.preventDefault();

                if (!this.state.questionData.votesB.includes(this.state.currentUser.data.new_user.id)) {
                    axios.post(`${process.env.REACT_APP_BACKEND_IP}/api/question/${this.state.questionData._id}/vote`, {
                        userId: this.state.currentUser.data.new_user.id,
                        voteA: false,
                        unvote: false
                    },{
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': this.state.currentUser.data.token
                        }
                    }).then((response) => {
                        console.log(response);
                        this.setState({questionData : response.data})

                    }).catch((err) => {


                        if(err.response.status===401){
                            authService.logout();
                        }                        
                        
                    });
                }
            }

            let voteAButton = <Button variant="warning" type="normal" onClick={handleVoteA}>Vote</Button>;
            let voteBButton = <Button variant="warning" type="normal" onClick={handleVoteB}>Vote</Button>;


            let contentIfLoggedIn = <> <Col className="p-4" md={5}>

                <Row className="no-gutters border rounded overflow-hidden flex-md-row position-relative">
                    <Col className="p-2 d-flex flex-column position-static justify-content-center bg-light">

                        <h3 className="mb-0 text-center">{this.state.questionData.optionA}?</h3>

                        <hr />
                        {!this.state.questionData.votesA.includes(this.state.currentUser.data.new_user.id) && !this.state.questionData.votesB.includes(this.state.currentUser.data.new_user.id) ? voteAButton : this.state.questionData.votesA.includes(this.state.currentUser.data.new_user.id) ? "" : ""}

                        <small className="mb-0 text-center">{votesForA ? "Votes: " + votesForA + ", " + (aPercent * 100).toFixed(2) + "%" : "No votes yet!"}</small>

                    </Col>
                </Row>
            </Col>


                <Col className="p-4" md={2}>


                    <Row className="no-gutters flex-md-row position-relative">
                        <Col className="p-2 d-flex flex-column position-static justify-content-center ">

                            <h3 className="mb-0 text-center">OR</h3>
                            <small className="mb-0 text-center">{votesForA ? (votesForB ? votesForA + votesForB + " total votes!" : "No votes yet!") : "No votes yet!"}</small>

                        </Col>
                    </Row>

                </Col>


                <Col className="p-4" md={5}>


                    <Row className="no-gutters border rounded overflow-hidden flex-md-row position-relative">

                        <Col className="p-2 d-flex flex-column position-static justify-content-center bg-light">

                            <h3 className="mb-0 text-center">{this.state.questionData.optionB}?</h3>
                            <hr />
                            {!this.state.questionData.votesA.includes(this.state.currentUser.data.new_user.id) && !this.state.questionData.votesB.includes(this.state.currentUser.data.new_user.id) ? voteBButton : this.state.questionData.votesB.includes(this.state.currentUser.data.new_user.id) ? "" : ""}
                            <small className="mb-0 text-center">{votesForB ? "Votes: " + votesForB + ", " + (bPercent * 100).toFixed(2) + "%" : "No votes yet!"}</small>

                        </Col>

                    </Row>

                </Col>


                <Col className="p-4" md={6}>

                    {commentsArray? <CommentBox comments={commentsArray} questionId={this.props.match.params.id}/>:""}

                </Col>

                <Col className="p-4" md={6}>


                </Col>
            </>;


            let completedQBox = <Row className="border rounded shadow-sm bg-white" mb={2}>

                <Col className="mt-4 text-center" md={12}>

                    <h4>{this.state.questionData ? "Would you rather..." : "Something went wrong!"}</h4>

                </Col>

                {contentIfLoggedIn}

            </Row>;


            return (completedQBox)
        }
    }

};



export default QuestionBox;