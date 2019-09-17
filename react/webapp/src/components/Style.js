import React, { Component } from "react"
import { makePostRequest, makeGetRequest } from "../api_calls";
import { connect } from "react-redux"
import sendIcon from "../images/icons/send.svg"
import Loading from "../general/Loading"

class Style extends Component {
    constructor(props) {
        super(props)
        console.log('PORPS:', props)
        this.state = {
            allStyles: window.styles,
            styles: [],
            request_loading: false,
            request: ''
        }
   }

    componentDidUpdate = () => {
        console.log(this.props.styles)
        console.log(this.state.styles)
        if (this.props.styles && this.state.styles != this.props.styles) {      // if style props passed and state is not equal
            this.setState({styles: this.props.styles})                          // equate the styles
        }
    }

    handleOptionChange = (e) => {
        // console.log(e.target)
        // console.log(e.target.id)
        // console.log(this.props.styles.includes(e.target.id))
        console.log(this.state.styles)
        var styles = this.state.styles
        if (this.props.styles.includes(e.target.id)) {
            console.log('removing style')
            styles = styles.filter( (item) => {return item != e.target.id} )
        }
        else {
            console.log('addign style')
            styles.push(e.target.id)
        }
        // console.log('# styles:', styles.length)
        // console.log({styles})
        // this.props.set_user({styles})
        // makePostRequest(this.props.endpoint, {styles}, 
        //     () => {console.log('dets updated')}
        // )
        this.props.onChange(styles)
    }

    handleRequestChange = (e) => {
        this.setState({request: e.target.value},
            () => {console.log(this.state)}    
        )
    }

    submitRequest = () => {
        var request = this.state.request.toLowerCase()
        if (request != '') {
            if (! this.state.allStyles.includes(request)) {
                this.setState({
                    allStyles: [...this.state.allStyles, request],
                })
            }
            this.setState({
                request: ''
                // request_loading: true
            })
            this.handleOptionChange({target: {id: request}})
            makePostRequest('feature-request', {type: 'new tag request', request: request},
                () => {
                    console.log('brand requested')
                }
            )
        }
    }

    render() {
        console.log('PROPS:', this.props)
        console.log('STYLES:', this.props.styles)
        var styles = this.props.styles
        var allStyles = Array.from(new Set([...this.state.allStyles, ...styles]))
        return (
            <div className="panel">
                <div className="medium">
                    {/* Your style */}
                    {this.props.title}
                </div>
                <div className="" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {
                        allStyles.map(
                            (item) => {
                            // console.log(item)
                                var opacity = styles.includes(item) ? '1' : '0.5'
                                return <React.Fragment>
                                    <label for={item} style={{opacity}} value={styles.includes(item)}>
                                        <button className="btn text-btn" id={item} onClick={this.handleOptionChange}>
                                            <input className="radio_btn" type="radio" checked={styles.includes(item)}/>
                                            {item}
                                        </button>
                                    </label>
                                </React.Fragment>
                            }
                        )
                    }
                </div>
                <div style={{marginTop: '30px'}}>
                    <div><strong>Enter your own tag!</strong></div>
                    <div className="searchbar">
                        <input value={this.state.request} onChange={this.handleRequestChange} className="text-response" placeholder='Enter a missing word...' style={{fontSize: '13px'}} />
                        <button onClick={this.submitRequest}>
                            {
                                this.state.request_loading ?
                                <Loading />
                                :
                                <img src={sendIcon} style={{height: '30px'}} />
                            }
                        </button>
                    </div>
                </div>
                {/* <button className="btn" onClick={this.handleSubmit}>
                    Done
                </button> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        styles: state.user.styles ? state.user.styles : []
    }
}

export default Style = connect(mapStateToProps)(Style)