import React, { Component } from "react"
import edit from "../images/icons/edit.svg"
import save from "../images/icons/save.png"
import "./Bio.css"
import { makePostRequest } from "../api_calls";

class Bio extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editing: false,
            bio: ''
        }
    }

    componentDidUpdate = () => {
        console.log(this.props.bio)
        console.log(this.state.bio)
        if (this.props.bio && this.state.bio != this.props.bio) {      // if style props passed and state is not equal
            this.setState({bio: this.props.bio})                          // equate the bio
        }
    }

    onBioChange = (e) => {
        this.setState({bio: e.target.value})
    }

    onBioSave = () => {
        this.setState({editing: false})
        makePostRequest('stylist-my-info', {bio: this.state.bio},
            () => {console.log('bio saved')}
        )
    }

    render() {
        return (
            <div className="panel bio">
                <div className="medium">
                    Bio
                </div>
                {
                    this.state.editing ?
                    <>
                        <img onClick={this.onBioSave} src={save} />
                        <textarea className="text-response" value={this.state.bio} onChange={this.onBioChange}>
                        </textarea>
                    </>
                    :
                    <>
                    <img onClick={() => {this.setState({editing: true})}} src={edit} />
                    <div style={{position: 'relative'}}>
                        {
                            this.state.bio != '' ?
                            this.state.bio
                            :
                            'Edit a bio'
                        }
                    </div>
                    </>
                }
            </div>
        )
    }
}

export default Bio