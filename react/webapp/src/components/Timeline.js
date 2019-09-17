import React, { Component } from "react"
import { connect } from "react-redux";
import Recommendation from "../adminComponents/Recommendation"
import "./Timeline.css"
import { makeGetRequest } from "../api_calls";

class Stage extends Component {
    render() {
    console.log(this.props)
    var {stage, type} =  this.props
    if (!stage) {return null}
    switch (type){
        case "request":
            console.log('request stage:', stage)
            return (
                <div className="stage">
                    <div className="marker"></div>
                    <div className="stage-heading medium">
                        <div className="stage-title small">
                            <strong>
                                Request:
                            </strong>
                        </div>
                        <div className=" stage-timestamp small">
                            {stage.timestamp}
                        </div>
                    </div>
                    <div className="stage-content">
                        {stage.request}
                    </div>
                </div>
            )
        case "recommendations": 
            return (
                <div className="stage">
                    <div className="marker"></div>
                    <div className="stage-heading medium">
                        <div className="stage-title small">
                            <strong>
                                Recommendations:
                            </strong>
                            <div>
                                Remove what you DON'T want to try on
                            </div>
                        </div>
                    </div>
                    <div className="stage-content stage-recommendations-container">
                        {stage.map((rec) => {
                            return <Recommendation rec={rec} refresh={this.props.refresh} />})
                        }
                    </div>
                </div>
            )
        case "order":
            return null
        case "payment":
            return null
        case "pick up":
            return null
        default: 
            return <div>Didnt find it</div>
    }
    }
}

class Timeline extends Component {

    componentDidMount = () => {
        makeGetRequest('get-my-recommendations', 
            (data) => {
                console.log(data)
            }
        )
    }

    getRequest = () => {
        return <Stage stage={this.props.request} type="request"/>
    }

    getRecommendations = () => {
        return <Stage stage={this.props.recommendations} type="recommendations" refresh={this.props.refresh} />
    }

    render() {
        console.log('Timeline props:', this.props)
        console.log('type:', typeof(this.props))
        return (
            <div className="timeline-container">
                <div className="timeline"></div>
                <div className="stages">
                    {this.getRequest()}
                    {this.getRecommendations()}
                </div>
            </div>
        )
    }
}

export default Timeline = connect()(Timeline)