import React, { Component } from "react"
import { makeGetRequest } from "../api_calls"
import Section from "../components/Section"
import { connect } from "react-redux"

class Messages extends Component {
    constructor(props) {
        super(props)
        this.path = this.props.match.path
        this.state = {
            messages: []
        }
    }

    componentDidMount = () => {
        makeGetRequest('admin-get-messages',
            (messages) => {
                console.log(messages)
                messages = messages.body
                messages = JSON.parse(messages)
                console.log(messages)
                messages = messages.Items
                messages = messages.sort(
                    (msg1, msg2) => {
                        return new Date(msg2.time) - new Date(msg1.time)
                    }
                )
                console.log(messages)
                messages = messages.map(
                    (msg) => {
                        console.log('msg:', msg)
                        return <Section to={`/5015db37-0d03-4f44-93a5-606ac215935b/admin/messaging?user_id=${msg.user_id}`} passthrough={msg} title={msg.time} caption={msg.joined}/>
                    }
                )
                this.setState({messages: messages})
            }
        )
    }

    render () {
        return (
            <div className="body">
                <div className="medium">
                    All Messages
                </div>
                {this.state.messages}
            </div>
            
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        messages: state.messages
    }
}

export default Messages 