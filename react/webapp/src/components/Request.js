import React, { Component } from "react"
import Timeline from "./Timeline"
import RespondToRecommendations from "./RespondToRecommendations"

export default class Request extends Component {
    constructor (props) {
        super(props)
        console.log(this.props.location.state)
        this.request = this.props.location.state
    }

    componentDidMount = () => {
        window.analytics.page('request')
    }

    render () {
        console.log('THIS REQUEST:', this.request)
        return (
            <div className="body">
                <div className="large">Request title</div>
                <div className="small">Track your clothes, check up on, and change your orders</div>
                <Timeline request={this.request}/>
                <TimelineOptions request={this.request}/>
            </div>
        )
    }
}

const TimelineOptions = (props) => {
    var request = props.request
    var options = []
    if (request) {
        console.log(request)
        options.push(<RespondToRecommendations />)
    }
    options = []    // SHOW NO OPTIONS FOR NOW
    return (
        options.length ? <div className="btn">yo</div> : null
    )
}