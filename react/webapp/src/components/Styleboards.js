import React, { Component } from "react"
import "./Styleboards.css"
import { Auth, Storage } from "aws-amplify"
/*import plus from "../images/icons/plus.svg"
import { uploadFile } from 'react-s3';
import { file } from "@babel/types";*/
import uuid from "uuid"


class StyleboardImage extends Component {
    render() {
        return (
            <img src={this.props.src} alt="" />
        )
    } 
}

class StyleboardColumn extends Component {

    getImgs = () => {
        var srcs = this.props.srcs
        var imgs = []
        srcs.map(
            (src) => {
                imgs.push(<StyleboardImage src={src} />)
            }
        )
        console.log('THIS COLUMNS IMAGES', imgs)
        return imgs
        
    }

    render() {
        return (
            <div className="column">
                {this.getImgs()}
            </div>
        )
    }
}

export default class Styleboard extends Component {
    constructor(props) {
        super(props)
        Auth.currentSession()
        .then(
            data => {
                console.log('cognito response:', data)
                var IDToken = data.getIdToken().getJwtToken()
                var options = {
                    method: 'GET',
                    headers: {
                        "Authorization": IDToken,
                    }
                }
                fetch('https://ikpilfsw9a.execute-api.eu-west-2.amazonaws.com/prod/get-styleboards', options)
                .then(data => data.json())
                .then(
                    data => {
                        console.log(data)
                        data = JSON.parse(data.body)
                        console.log(data)
                        if (data == null) {
                            this.setState({imgs: []})
                        }
                        else {
                            this.setState({imgs: data})
                        }
                    }
                )
            }
        )
        this.state = {
            name: 'first styleboard',
            ready: true,
            imgs: []
        }
    }

    componentDidMount = () => {
        window.analytics.page('styleboards')
    }

    addImg = (e) => {
        console.log('adding image')

        // UPLOAD FILE
        var files = e.target.files
        /*
        const config = {
            bucketName: 'Adla-data',
            dirName: 'uploads', 
            region: 'eu-west-1',
        }
        */
        for (var i=0; i<files.length; i++) {
            var fp = `styleboard_uploads/${uuid.v4()}`
            var url
            Storage.put(fp, files[i])
            .then(
                result => {
                    url =`https://s3-eu-west-1.amazonaws.com/Adla-data/public/${fp}`
                    console.log('URL:', url)
                    var i = this.state.imgs
                    console.log(i)
                    console.log(typeof(i))
                    i.push(url)
                    this.setState({imgs: i})
                    return url
                }
            )
            .then(
                url => {
                    Auth.currentSession()
                    .then(
                        data => {
                            var IDToken = data.getIdToken().getJwtToken()
                            console.log('adding this to users styleboard json:', url)
                            var options = {
                                method: 'POST',
                                mode: 'cors',
                                body: JSON.stringify([url]),
                                headers: {
                                    "Authorization": IDToken,
                                    'Content-Type': 'application/json'
                                }
                            }
                            fetch("https://ikpilfsw9a.execute-api.eu-west-2.amazonaws.com/prod/add-to-style-board", options)    // ADD FILE TO STYLEBOARD JSON
                            .then(
                                data => {
                                    console.log('done adding')
                                    console.log(data)
                                }
                            )
                        }
                    )
                }
            )
            .catch(err => console.log(err))
        }
    }

    render() {
        if (this.state.ready) {
            let c1=[], c2=[], c3=[], c4=[]
            var cols = [c1, c2, c3, c4]

            for (var idx = 0; idx < this.state.imgs.length; idx++) {
                var col_idx = idx % cols.length
                cols[col_idx].push(this.state.imgs[idx])
            }

            console.log('COLS', cols)

            return (
                <div className="body" id="styleboards">
                    <div className="panel-title">My styleboard</div>
                    <div className="board">
                        {(c1.length !== 0) ? 
                            <React.Fragment>
                                <StyleboardColumn srcs={c1} />
                                <StyleboardColumn srcs={c2} />
                                <StyleboardColumn srcs={c3} />
                                <StyleboardColumn srcs={c4} />
                            </React.Fragment>
                            :
                            <div className="empty-styleboard-prompt">
                                <div>
                                    Press the button below to add images to your styleboard
                                </div>
                                <div>
                                    Fill this styleboard with pictures of styles that you like.
                                </div>
                                <div>
                                    I can use this to help find exactly what you're after. You can even ask me to find you clothes that match what's on this styleboard!
                                </div>
                            </div>
                        }
                    </div>
                    <div className="btn styleboard_upload">
                        <input id="add_img" type="file" style={{display: "none"}} accept="image/*" name="img" onChange={this.addImg} multiple />
                        <label for="add_img">Add images</label>
                    </div>
                </div>
            )
        }
        else return null
    }
}