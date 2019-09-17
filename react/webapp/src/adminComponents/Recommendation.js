import React, { Component } from "react"
import {makePostRequest } from "../api_calls.js"
import "./Recommendation.css"
import undo from "../images/icons/undo.png"
import { connect } from "react-redux"

class Recommendation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rejected: null
        }
    }

    rejectRecommendation = () => {
        var body = {rec: [this.props.rec], action: 'remove'}
        //this.setState({rejected: 'rejected'})               // set to 'rejected' so that case is matched in getOptions

        makePostRequest('update-recommendation?', body, 
            () => {
                console.log('request made')
                this.props.refresh()
            }
        )
    }

    unrejectRecommendation = () => {
        this.setState({rejected: false})
        var body = {...this.props.rec, action: 'unreject'}
        makePostRequest('update-recommendation', body, 
            () => {
                console.log('request made')
                this.props.refresh()
            }
        )
    }

    getOptions = () => {
        switch (this.props.rec.status) {
            case 'rejected' || this.state.rejected:
                return (
                    <div className="rec-rejection rec-response medium">
                        Rejected
                        <img className="unreject" src={undo} onClick={this.unrejectRecommendation} />
                    </div>
                )
            case 'not yet recommended':
                return (
                    <button className="btn" onClick={this.rejectRecommendation}>
                        Remove from order
                    </button>
                )
            case 'recommended':
                return <div className="medium rec-response">
                    Recommended
                </div>
            default:
                return null    
        }
    }

    render() {
        return (
            <div className="recommendation">
                <img src={this.props.rec.img_urls[0]} alt="" />
                {this.getOptions()}
            </div>
        )
    }
}

export default Recommendation 