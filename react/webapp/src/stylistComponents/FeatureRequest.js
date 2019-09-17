import React, { Component } from "react"
import Loading from "../general/Loading"
import sendIcon from "../images/icons/send.svg"
import { makePostRequest } from "../api_calls"

class FeatureRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            loading: false
        }
    }

    handleRequestChange = (e) => {
        this.setState({msg: e.target.value},
            () => {console.log(this.state)}    
        )
    }

    submitRequest = () => {
        this.setState({loading: true})
        makePostRequest('feature-request', {type: 'new feature request', request: this.state.msg},
            () => {
                console.log('brand requested')
                this.setState({msg: '', loading: false})
            },
            () => {this.setState({loading: false}); alert('Something went wrong! Let Harry know')}
        )
    }

    
    render() {
        return (

                <div style={{marginTop: '50px'}}>
                    <div className="medium">Request a new feature</div>
                    <div className="small">
                        I want to make this amazing for you! 
                        <br/>
                        Let me know what you want and I will literally build it!
                    </div>
                    <div className="">
                        <textarea value={this.state.msg} onChange={this.handleRequestChange} className="text-response" style={{width: '90vw', height: '100px', maxWidth: '600px'}} placeholder='Enter something you want me to build...'/>
                    </div>
                        <button onClick={this.submitRequest} className="btn">
                            {
                                this.state.loading ?
                                <Loading />
                                :
                                <img src={sendIcon} style={{height: '30px'}} />
                            }
                        </button>
                </div>
        )
    }
}

export default FeatureRequest