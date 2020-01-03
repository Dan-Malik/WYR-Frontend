import React, { Component } from 'react';
import axios from 'axios';

import { Row, Col, Button } from 'react-bootstrap';
import { authService } from '../services/authService';


class CommentBox extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentUser: null,
            commentData: this.props.comments,
            commentFormData: ""
        }

    }

    render() {

        return (

            <Row>
                <Col>
                    <div>
                        <h5>
                            {"Join the discussion:"}
                           </h5>
                            
                           <textarea className="form-control" placeholder="Write a comment..." rows="3"></textarea>

<div>
<Button variant="warning" block>Post</Button>
</div>

                        <div className="overflow-auto">
{/* 
regrettably set height with pixels - still looks good on most screens but not exactly a responsive solution */}
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