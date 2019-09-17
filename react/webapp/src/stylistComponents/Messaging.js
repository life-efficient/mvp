import React, { Component } from "react"
import send from "../images/icons/send.svg"
import "./Messaging.css"
import { makeGetRequest, makePostRequest } from "../api_calls"
import { Storage } from "aws-amplify" 
import queryString from "query-string"

class Messaging extends Component {
    constructor(props) {
        super(props)
        var params = queryString.parse(window.location.search)
        this.user_id = props.user_id ? props.user_id : params.sub
        this.update()
        this.state = {
            msgs: null,
            payload: {
                body: '',
                type: 'text'
            }
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.update, 600000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    update = () => {
        console.log('GETTING CHAT')
        makeGetRequest(`admin-chat?user_id=${this.user_id}`,
            (data) => {
                console.log(data)
                data= data.chats
                data = data.map(
                    (msg) => {
                        console.log('MSG:', msg)
                        if (msg.sender == null) {
                            return null
                        }
                        else {
                            return (
                                <div className={msg.sender == 'us' ? 'msg adla' : 'msg'}>
                                    {msg.body}
                                    {
                                        msg.our_instagram_media_url ?
                                        <img src={msg.our_instagram_media_url} />
                                        :
                                        null
                                    }
                                </div>
                            )
                        }
                    }
                )
                this.setState({msgs: data})
            }
        )
    }
    
    handleBodyChange = (e) => {
        this.setState({
            payload: {
                ...this.state.payload,
                body: e.target.value
            }
        },
            () => {
                // console.log(this.state.payload.body)
            }
        )
    }

    sendMessage = () => {
        console.log('SENDING:', this.state.payload)
        makePostRequest(`admin-chat?user_id=${this.user_id}`,
            this.state.payload,
            () => {
                console.log('message sent')
            }
        )
        this.setState({payload: {...this.state.payload, body: ''}})
    }

    render() {

        return (

                <div className="panel">
                    <div className="medium">
                        Adla's chat with them
                    </div>
                    <div id="chat">
                        <div id="msgs">
                            {this.state.msgs}
                        </div>
                        {/* <div id="reply">
                            <input id="textarea" value={this.state.payload.body} placeholder="Type a message" onChange={this.handleBodyChange}/>
                            {/* <input type="file" id="img_input" />
                            <label for="img_input" id="send_img" class="btn">
                                <img src={ig} id="icon" />
                            </label> 
                            <div id="send_btn" class="btn" onClick={this.sendMessage}>
                                <img src={send} id="icon" />
                            </div>
                        </div> */}

                    </div>

                    <div id="msg_prompts">

                    </div>

                </div>
        )
    }
}

export default Messaging