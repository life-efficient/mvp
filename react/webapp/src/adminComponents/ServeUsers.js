import React, { Component } from "react"
import { makeGetRequest } from "../api_calls"
import Section from "../components/Section"
import { connect } from "react-redux"

class ServeUsers extends Component {
    constructor(props) {
        super(props)
        this.path = this.props.match.path
        this.state = {
            unserved_requests: []
        }
    }

    componentDidMount = () => {
        makeGetRequest('get-unserved-requests',
            (reqs) => {
                console.log(reqs)
                console.log(typeof(reqs))
                reqs = reqs.Items
                console.log(reqs)
                reqs = reqs.sort(
                    (req1, req2) => {
                        return new Date(req2.timestamp) - new Date(req1.timestamp)
                    }
                )
                console.log(reqs)
                reqs = reqs.map(
                    (req) => {
                        console.log('req:', req)
                        return <Section to={`${this.path}/request?sub=${req.userSub}&req_id=${req.requestID}`} passthrough={req} title={req.request} caption={req.timestamp}/>
                    }
                )
                this.setState({unserved_requests: reqs})
            }
        )
    }

    render () {
        return (
            <div className="body">
                <div className="medium">
                    Unserved Requests 
                </div>
                {this.state.unserved_requests}
            </div>
            
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        unserved_requests: state.requests
    }
}

export default ServeUsers = connect(mapStateToProps)(ServeUsers)