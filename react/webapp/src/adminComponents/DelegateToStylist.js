import React, { Component } from "react"
import { connect } from "react-redux"
import { makePostRequest } from "../api_calls"
import queryString from "query-string"
import Loading from "../general/Loading"

class DelegateToStylist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assigned_to: this.props.assigned_to
        }
    }

    

    render() {
        return (
            <>
                <div className="medium">
                    Delegate to Stylist
                </div>
                {
                    this.props.stylists
                    .sort(
                        (s1, s2) => {
                            return s1.clients.length - s2.clients.length
                        }
                    )
                    .map(
                        (stylist) => {
                            return <Stylist stylist={stylist} assigned_to={this.state.assigned_to} />
                        }
                    )
                }
            </>
        )
    }
}

class Stylist extends Component{
    constructor(props) {
        super(props)
        console.log('STYLIST PROP:', props)
        var body = []
        for (var key of ['name', 'code', 'phone_number', 'stylist_id']) {
            console.log('')
            body.push(
                <div className="basic-info-elem">
                    <div>{key}:</div>
                    <div>{props.stylist[key]}</div>
                </div>
            )
        }
        this.state = {
            body,
            loading: false,
            assigned_to: this.props.stylist.assigned_to,
        }
    }

    delegate = () => {
        console.log('currently assigned to:', this.state.assigned_to)
        this.setState({loading: true})
        var params = queryString.parse(window.location.search)
        var user_id = params.sub
        var stylist_id = this.props.stylist.stylist_id
        makePostRequest('admin-delegate-to-stylist', {'user_id': user_id, 'stylist_id': stylist_id},
            () => {
                console.log('delegated')
                this.setState({loading: false, assigned_to: stylist_id})
            }
        )
        // .catch(
        //     () => {this.setState({loading: false})}
        // )
    }

    render() {
        var assigned = this.props.assigned_to ? this.props.assigned_to.includes(this.props.stylist.stylist_id) : null
        return (
            <div className="panel" style={{backgroundColor: 'white'}}>
                {this.state.body}
                <strong>Currently assigned {this.props.stylist.clients.length} users </strong><br/>
                <button className="" onClick={this.delegate} style={assigned ? {backgroundColor: "red"} : {backgroundColor : "green"}}>
                    {
                        this.state.loading ?
                        <Loading /> :
                        assigned ? "Unassign" : "Assign"
                    }
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        stylists: state.stylists
    }
}

export default DelegateToStylist = connect(mapStateToProps)(DelegateToStylist)