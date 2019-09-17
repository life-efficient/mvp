import React, { Component } from "react"
import Section from "./Section"
import { connect } from "react-redux"
import "./Requests.css"

class Requests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requests: []
        }
    }

    componentDidMount = () => {
        window.analytics.page('requests')
    }

    getRequests = () => {
        console.log('REQUESTS:', this.props.requests)
        var requests = this.props.requests.sort(
            (req1, req2) => {
                return new Date(req2[0].timestamp) - new Date(req1[0].timestamp)
            }
        )
        requests = requests.map(
            (request, idx) => {
                return (
                    <Section to={'/app/home/requests/request'} passthrough={request} title={`${idx + 1} - ${request.request}`}/>
                )
            }
        )   
        return requests
        
    }

    render() {
        console.log(this.state.requests)
        return (
            <div className="body">
                <div className="large">Your requests</div>
                <div className="small">Track your clothes, check up on, and change your orders</div>
                <div className="requests">
                    {this.getRequests()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('requests passed in as prop:', state.requests)
    return {
        requests: state.requests
    } 
}

export default Requests = connect(mapStateToProps)(Requests)