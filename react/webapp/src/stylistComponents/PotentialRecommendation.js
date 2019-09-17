import React, { Component } from "react"
import { connect } from "react-redux"
import { makeGetRequest, makePostRequest } from "../api_calls"
import "../components/Recommendations.css"
import "./PotentialRecommendations.css"
import queryString from "query-string"
import Loading from "../general/Loading";
import send from "../images/icons/greenSend.png"

class CaptionModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            caption: '',
            loading: false
        }
    }

    recommendItem = () => {
        this.setState({loading: true})
        console.log('recommending item')
        console.log(this.state.caption)
        var payload = {recs: [{...this.props.rec, user_id: this.props.user_id, caption: this.state.caption}], action: 'recommend'}
        console.log(payload)
        makePostRequest(`update-recommendation?sub=${this.props.user_id}`, payload,
            () => {
                console.log('Item added to orders')
                // this.props.refresh()
                var sub = queryString.parse(window.location.search).sub
                this.props.getRecommended()
                .then(
                    (recs) => {
                        this.props.closeModal()
                        var prompts = [
                            'Nice work!',
                            'Rec made!',
                            'Great work!',
                            'That\'s it!',
                            'Success!',
                            'Done'
                        ]
                        var num_left = 5 - recs.length
                        var update
                        if (num_left > 0) {
                            update = `Make ${num_left} more recommendation${num_left > 1 ? 's' : ''} to send these items to the user!`
                        }
                        else {
                            update = 'These recommendations will be sent to the user soon!'
                        }
                        var prompt = prompts[Math.floor(Math.random() * prompts.length)]
                        console.log('got recs:', recs)
                        this.props.notify(
                            <div className="small">
                                <strong>
                                    {prompt + ' ' + update}
                                </strong>
                            </div>
                        ); 
                        this.setState({loading: false})
                        console.log('yo')
                    }
                )
            },
            () => {
                this.setState({loading: false})
                this.props.notify(
                    <div className="medium">
                        Something went wrong 😭. Let Harry know!
                    </div>
                )
            }
        )
        this.setState({recommended: true})
    }

    handleChange = (e) => {
        this.setState({caption: e.target.value})
    }

    render() {
        return (
            <div className="modal-content">
                <div className="medium">
                    Caption
                </div>
                <div className="small">
                    Let them know why you made this specific recommendation.
                    <br/>
                    <br/> 
                    Examples: 
                    <br/>
                    This will go perfectly with the red jacket you own. 
                    <br/> 
                    This is the best material to keep you cool on your holiday that you told me about. 
                    <br/> 
                    It's 20% off!
                    <br/> 
                    ETC
                </div>
                <input className="text-response" value={this.state.caption} onChange={this.handleChange} />
                <button className="btn" onClick={this.recommendItem}>
                    {
                        this.state.loading ?
                        <Loading />
                        :
                        'Recommend!'
                    }
                    
                </button>
            </div>
        )
    }
} 

class PotentialRecommendation extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    getStyle = () => {
        console.log(this.props.already_recommended)
        var status = this.props.already_recommended || this.state.recommended
        switch(status) {
            case true: 
                return {opacity: 1, zIndex: 2}
            default:
                return {opacity: '0'}
        }
    }

    render() {
        var rec = this.props.rec
        return (
            <div className="potential-rec">
                <div className="product-type">{rec.product_type}</div>
                <div className="rec-status" style={this.getStyle()}></div>
                {/* <div className="price">{rec.currency}{rec.finalPrice}</div> */}
                {/* <div className="reject btn">Reject</div> */}
                <img className="try-on btn" id='animated-bt' 
                    onClick={() => {
                        this.props.openModal(
                            <CaptionModal 
                                user_id={this.props.user_id} 
                                rec={this.props.rec} 
                                closeModal={this.props.closeModal}
                                notify={this.props.notify}
                                getRecommended={this.props.getRecommended}
                            />
                        )
                    }}
                    src={send}
                />
                <img className="product-img" src={rec.img_urls[0]} alt=""/>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openModal: (content) => {
            dispatch({
                type: 'OPEN_MODAL',
                content
            })
        },
        closeModal: () => {
            dispatch({
                type: "CLOSE_MODAL"
            })
        },
        notify: (content) => {
            dispatch({
                type: "NOTIFY",
                content
            })
        }
    }
}

export default PotentialRecommendation = connect(null, mapDispatchToProps)(PotentialRecommendation)