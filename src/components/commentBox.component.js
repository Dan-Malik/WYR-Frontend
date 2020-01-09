import React, { Component } from 'react';
import axios from 'axios';

import { Row, Col, Button } from 'react-bootstrap';
import { authService } from '../services/authService';


class CommentBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            commentData: this.props.comments,
            questionId: this.props.questionId,
            commentFieldData: ""
        }

    }

    componentDidMount() {

        authService.currentUser.subscribe(userData => this.setState({ currentUser: userData }))
    }

    handleCommentFieldChange(event) {
        this.setState({ commentFieldData: event.target.value });
    }


    submitCommentButton(event) {
        event.preventDefault();

        if (localStorage.getItem('currentUser')) {

            let userData =  JSON.parse(localStorage.getItem('currentUser')).data.new_user;

            axios.post(`${process.env.REACT_APP_BACKEND_IP}/api/question/${this.state.questionId}/comment`, {
                postedUser: userData.id,
                postedUserName: userData.username,
                content: this.state.commentFieldData
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.state.currentUser.data.token
                }
            }).then((newComment)=>{

                console.log([...this.props.comments, newComment.data]);

                this.setState({commentData: [...this.props.comments, newComment.data] })

            }).catch((err)=>{
                console.log(err);
            });

        } else {
            console.log("Please log in to comment!")
        }

    }

    render() {

        return (

            <Row>
                <Col>
                    <div>
                        <h5>
                            Join the discussion:
                        </h5>

                        <textarea className="form-control" placeholder="Write a comment..." rows="3" onChange={this.handleCommentFieldChange.bind(this)}></textarea>

                        <div>
                            <Button variant="warning" block onClick={this.submitCommentButton.bind(this)} >Post</Button>
                        </div>

                        <div className="overflow-auto">
                            <ul className="list-group">

                                {
                                    this.state.commentData ? this.state.commentData.map(commentObj => <li className="list-group-item">
                                        <div className="d-flex justify-content-between">

                                            <b className="text-success">{commentObj.postedUserName}</b>
                                            <small className="text-muted">{new Date(commentObj.datePosted).toLocaleDateString(undefined)}</small>

                                        </div>
                                        <p>{commentObj.content}</p>

                                    </li>

                                    ) : ""
                                }

                            </ul>

                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default CommentBox;