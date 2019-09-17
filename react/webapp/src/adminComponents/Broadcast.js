import React, { Component } from "react"
import { makePostRequest } from "../api_calls"
import Navbar from "./Navbar"
import Loading from "../general/Loading"

class Broadcast extends Component {
    constructor(props){
        super(props)
        this.state = {
            msg: '',
            loading: false
        }
    }

    send = () => {
        this.setState({loading: true})
        makePostRequest('admin-broadcast', {'msg': this.state.msg, group: 'stylists'},
            (resp) => {
                console.log('broadcast sent')
                this.setState({loading: false, msg: ''})
            },
            (err) => {
                console.log(err)
                this.setState({loading: false})
            }
        )

    }

    handleChange = (e) => {
        this.setState({msg: e.target.value})
    }

    render() {
        return (
            <>
            <Navbar back={true}/>
            <div className="panel">
                <div className="medium">
                    Broadcast a message to the stylists
                </div>
                <textarea value={this.state.msg} onChange={this.handleChange} className="text-response"/>
                <button className="btn" onClick={this.send}>
                    {
                        this.state.loading ?
                        <Loading /> :
                        "Send to stylists"
                    }
                </button>
            </div>
            </>
        )
    }
}

export default Broadcast