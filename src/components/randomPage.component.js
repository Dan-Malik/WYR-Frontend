import React from 'react';
import axios from 'axios';

export default class RandomPage extends React.Component {

    componentDidMount(){
        axios.get(`${process.env.REACT_APP_BACKEND_IP}/api/question/random/id`).then(
            (result)=>{
                this.props.history.push(`/question/id/${result.data[0]._id}`);
            }
        ).catch(
            (err)=>{
                console.log(err);
            }
        );
    }

    render(){
        return (<></>)
    }


}