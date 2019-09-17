import React, { Component } from "react"
import posed from 'react-pose';
import "./NewRequest.css"
import "./store.css"
import { Auth } from "aws-amplify"
import { connect } from "react-redux"
import { makeGetRequest, makePostRequest } from "../api_calls"

class NewRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            request: '',
            tags: [
                'vintage',
                'second hand'
            ]
        }
    }

    makeRequest = () => {
        console.log('making request')
        makePostRequest('make-request', this.state,
            (data) => {
                console.log('request made')
                console.log(data)
            }
        )
        // Auth.currentSession()
        // .then(
        //     data => {
        //         var IDToken = data.getIdToken().getJwtToken()
        //         var options = {
        //             method: 'POST',
        //             mode: 'cors',
        //             body: JSON.stringify(this.state),
        //             headers: {
        //                 "Authorization": IDToken,
        //                 'Content-Type': 'application/json'
        //             }
        //         }
        //         fetch("https://ikpilfsw9a.execute-api.eu-west-2.amazonaws.com/prod/make-request", options)
        //         .then(
        //             makeGetRequest('get-my-requests', 
        //                 (requests) => {
        //                     requests = JSON.parse(requests.body)
        //                     this.props.setRequests(requests)
        //                     this.props.history.push('/app/home/requests')
        //                     window.analytics.track('Request made')
        //                     //return <Redirect to="/profile" />         // not
        //                 }
        //             )
        //         )
        //     },
        //     err => {
        //         console.log('AN ERROR OCCURED WHILST GETTING THE SESSION')
        //         console.log(err)
        //     }
        // )
        // .catch(
        //     (err) => {console.log(err)}
        // )
    }

    handleChange = (e) => {
        this.setState({[e.target.id]: e.target.value}, 
            () => {
                console.log(this.state)
            })
    }

    render() {
        return (
            <>
                <div className="field-container long-field-title">
                    <div className="field-title" style={{fontFamily: 'var(--font1)'}}>
                        Describe your style and what you're looking for
                    </div>
                    <textarea className="text-response" id="request" placeholder="I'm looking for..." onChange={this.handleChange} value={this.state.request}/>
                </div>
                {/* <div className="grid-response">
                    <button className="btn">
                        <label for="vintage" >
                            yo
                        </label>
                    </button>
                </div> */}
                <button onClick={this.state.request == '' ? this.props.not_now : () => {this.makeRequest(); this.props.onSubmit()}} >
                    {this.state.request == '' ? 'Nothing right now' : 'Submit'}
                </button>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setRequests: () => {
            console.log('settign requests')
             makeGetRequest('get-my-requests', data => {
                data = JSON.parse(data.body)
                console.log(data)
                dispatch({type: "SET_REQUESTS", requests: data})
                console.log('set requests')
            })
        }
    }
}

export default NewRequest = connect(null, mapDispatchToProps)(NewRequest)