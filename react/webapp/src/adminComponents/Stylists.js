import React, { Component} from "react"
import { connect } from "react-redux"
import Loading from "../general/Loading"
import { makePostRequest } from "../api_calls"
import Navbar from "../components/Navbar"
import "./Stylists.css"
import default_dp from "../images/misc/default-profile.png"

class AddStylist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            name: '',
            code: '',
            instagram: '',
            location: '',
            paypal: '',
            call_time: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        },
            () => {
                console.log(this.state)
            }
        )
    }

    handleSubmit = () => {
        console.log('submitting')
        makePostRequest('admin-stylists', this.state,
            (response) => {
                console.log(response)
                console.log('done')
                this.props.closeSlideUp()
            }
        )
    }

    render() {
        var isValid = this.state.name && this.state.instagram
        console.log(isValid)
        return (
            <div className="panel" style={{backgroundColor: 'var(--green)'}}>
                <div className="medium">
                    Add a stylist!
                </div>
                <div className="form-container">
                    <div className="field-container">
                        <div className="field-title">
                            Name
                        </div>
                        <input id='name' value={this.state.name} onChange={this.handleChange} className="text-response"/>
                    </div>
                    <div className="field-container">
                        <div className="field-title">
                            Referral code
                        </div>
                        <input id='code' value={this.state.code} onChange={this.handleChange} className="text-response"/>
                    </div>
                    <div className="field-container">
                        <div className="field-title">
                            Instagram
                        </div>
                        <input id='instagram' value={this.state.instagram} onChange={this.handleChange} className="text-response"/>
                    </div>
                    <div className="field-container">
                        <div className="field-title">
                            Location
                        </div>
                        <input id='location' value={this.state.location} onChange={this.handleChange} className="text-response"/>
                    </div>
                    <div className="field-container">
                        <div className="field-title">
                            Paypal
                        </div>
                        <input id='paypal' value={this.state.paypal} onChange={this.handleChange} className="text-response"/>
                    </div>
                    <div className="field-container">
                        <div className="field-title">
                            Call time
                        </div>
                        <input id='call_time' value={this.state.call_time} onChange={this.handleChange} className="text-response"/>
                    </div>
                    <button className="btn" disabled={!isValid} onClick={this.handleSubmit} style={{opacity: isValid ? 1 : 0.2}}>
                        {
                            this.state.loading ?
                            <Loading /> :
                            "Submit"
                        }
                    </button>
                </div>
            </div>
        )
    }
}

class Stylists extends Component  {

    render() {
        console.log('STYLIST PROP:', this.props)
        var elems = this.props.stylists.map(
            (item) => {
                var body = []

                for (let [key, value] of Object.entries(item)) {
                    if (typeof(value) == 'string'){
                        body.push(
                            <div className="basic-info-elem">
                                <div>{key}:</div>
                                <div>{value}</div>
                            </div>
                        )
                    }
                }
                return (
                    <div className="panel">
                        {body}
                    </div>
                )
            }
        )

        console.log(elems)
        return(
            <>
                <div style={{backgroundColor: 'var(--blue)'}}>

                    <Navbar back={true} />
                    <div className="medium">
                        Manage Stylists
                    </div>

                    <button className="btn" onClick={() => {this.props.openSlideUp(<AddStylist closeSlideUp={this.props.closeSlideUp}/>)}}>
                        Add a stylist
                    </button>

                    {/* {elems} */}
                    {
                        this.props.stylists.map(
                            (s) => {
                                return (
                                    <div className="panel">
                                        {
                                            s.display_pic ?
                                            <img src={s.display_pic} alt="" className="small-dp"/>
                                            :
                                            <img src={default_dp} alt="" className="small-dp"/>
                                        }
                                        <div className="medium">
                                            {s.name}
                                        </div>
                                        {
                                            Object.keys(s).map(
                                                (k) => {
                                                    if (['location', 'instagram', 'call_time'].includes(k)) {
                                                        return (
                                                            <div className="basic-info-elem">
                                                                <div>{k}:</div>
                                                                <div>{s[k]}</div>
                                                            </div>
                                                        )
                                                    }
                                                    else if (k == 'styles') {
                                                        return (
                                                            <div className="tags" style={{justifyContent: 'left'}}>
                                                                {s[k] ? s[k].map((style) => {return <div className="tag">{style}</div>}) : null}
                                                            </div>
                                                        )
                                                    }
                                                }
                                            )
                                        }

                                    </div>
                                )
                            }
                        )
                    }
                </div>
                
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        stylists: state.stylists
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openSlideUp: (content) => {
            dispatch({
                type: 'OPEN_SLIDEUP',
                content: content
            })
        },
        closeSlideUp: () => {
            dispatch({
                type: "CLOSE_SLIDEUP"
            })
        }
    }
}

export default Stylists = connect(mapStateToProps, mapDispatchToProps)(Stylists)