import React, { Component } from "react"
import { makeGetRequest, makePostRequest } from "../api_calls"
import "./Recommendations.css"
import heart from "../images/icons/heart.png"
import tick from "../images/icons/tick.png"
import redcross from "../images/icons/redcross.png"
import Navbar from "./Navbar"

class Recommendation extends Component {
    constructor(props) {
        super(props)
    }

    getStyle = () => {
        var status = this.props.rec.status
        switch(status) {
            case 'needs ordering': 
                return {color: 'orange', opacity: 1, zIndex: 2}
            case 'ordered': 
                return {color: 'orange', opacity: 1, zIndex: 3}
            case 'rejected':
                return {color: 'red', opacity: 1, zIndex: 3}
            default:
                return {opacity: '0'}
        }
    }

    getText = () => {
        var status = this.props.rec.status
        switch(status) {
            case 'needs ordering': return 'On its way!'
            case 'ordered': return 'On its way!'
            case 'delivered': return 'With you'
            case 'returned':return 'Returned'            
            case 'purchased': return 'Purchased'
            case 'rejected': return 'Rejected'
            default: return null
        }
    }

    orderItem = () => {
        makePostRequest('update-recommendation', {...this.props.rec, action: 'needs ordering'},
            () => {
                console.log('Item added to orders')
                this.props.refresh()
            }
        )
    }

    rejectItem = () => {
        makePostRequest('update-recommendation', {...this.props.rec, action: 'reject'},
            () => {
                console.log('Item added to orders')
                this.props.refresh()
            }
 )
    }

    render() {
        var rec = this.props.rec
        console.log(rec)
        return (
            <div className="my-rec">
                <div className="rec-status" style={this.getStyle()}>{this.getText()}</div>
                <div className="rec-idx">{rec.idx}.</div>
                <div className="price">{rec.currency}{rec.final_price}</div>
                {/* <div className="reject btn">Reject</div> */}
                <img src={redcross} className="reject btn" id='animated-bt' onClick={this.rejectItem}/>
                {/* <div className="try-on btn" id='animated-bt' onClick={this.orderItem}>Try on for free</div> */}
                <img src={tick} className="try-on btn" id='animated-bt' onClick={this.orderItem}/>
                <img src={rec.img_urls[0]} className="product-img" alt=""/>
            </div>
        )
    }
}

class Recommendations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recommendations: null
        }
        this.getMyRecommendations()
    }

    getMyRecommendations = () => {
        makeGetRequest('recommendations',
            (data) =>{
                
                console.log('recommendations:', data)
                data = data.body
                data = JSON.parse(data)
                console.log('recommendations:', data)
                data = data.map(
                    (rec, idx) => {
                        return <Recommendation rec={rec} key={idx} refresh={this.getMyRecommendations}/>
                    }
                )
                console.log(data)
                console.log(data.length)
                this.setState({recommendations: data})
            }
        )
    }

    render() {
        return (
            <div className="body">
                <Navbar />
                <div className="medium">
                    Your recommendations
                </div>
                {(this.state.recommendations === null || this.state.recommendations.length == 0) ? 
                    null
                    :
                    <div className="small">
                        <strong>Your recommendations from this week</strong>
                        <br/>
                        <br/>
                        Let me know what you want to try on, and what you don't so the next ones will be better!
                    </div>
                }
                    
                {
                    (this.state.recommendations === null || this.state.recommendations.length == 0) ? 
                        <div style={{color: 'var(--primary)', marginTop: '60px'}}>
                            I'll be in contact with you in a minute...
                            <br/>
                            <br/>
                            <strong>Keep an eye on your instagram DMs!</strong>
                        </div>
                        :
                    <div className="my-recs">
                        {this.state.recommendations}
                    </div>
                }
            </div>
        )
    }
}

export default Recommendations