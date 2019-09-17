import React, { Component } from "react"
import { makeGetRequest, makePostRequest } from "../api_calls"
import Section from "../components/Section"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Loading from "../general/Loading"
import "./AllUsers.css"
import Searchbar from "../general/Searchbar";

class AllUsers extends Component {
    constructor(props) {
        super(props)
        this.path = this.props.match.path
        this.state = {
            unserved_useruests: null
        }
    }

    getAssignedStylistName = (user_id) => {
        var stylist_names = []
        for (var stylist of this.props.stylists) {
            if (stylist.clients.includes(user_id)) {
                stylist_names.push(stylist.name)
            }
        }
        stylist_names = stylist_names.reduce(
            (accumulator, currentVal) => {return currentVal+ ', ' + accumulator },
            ''
        )
        console.log(stylist_names)
        return stylist_names
    }

    componentDidMount = () => {
        makeGetRequest('admin-get-all-users',
            (users) => {
                console.log(users)
                users = users.body
                users = JSON.parse(users)
                users = users.sort(
                    (user1, user2) => {
                        return new Date(user2.joined) - new Date(user1.joined)
                    }
                )
                console.log(users)
                users = users.map(
                    (user) => {
                        console.log('user:', user)
                        console.log(user.requests)
                        var stylist
                        return (
                            <User user={user} />
                        )
                    }
                )
                this.setState({unserved_useruests: users})
            }
        )
    }

    render () {
        console.log('stylists:', this.props.stylists)
        return (
            <>
            <Navbar back={true}/>
            <div className="body" style={{backgroundColor: '#EA653C'}}>
                <div className="medium page-title">
                    All users
                </div>
                {/* <div className="">
                    <Searchbar map={(item) => {return <User user={item} />}} prompt='Search by IG username...' />
                </div> */}
                {/* <User user={{
                    acq_channel: "Instagram",
                    contact_method: "phone_number",
                    gender: "Female",
                    joined: "2019-06-11 01:17:11",
                    location: "London",
                    name: "Sam",
                    phone_number: "4407793818344",
                    price_range: "less than 80",
                    requests: [{
                        request: "Dress",
                        served: false,
                        timestamp: "2019-06-11 01:17:11"
                    }],
                    swipe_responses: [],
                    user_sub: "7180428c-7600-4114-ab0a-1a2c52300b8c"
                }}/> */}
                {
                    this.state.unserved_useruests ?
                    this.state.unserved_useruests :
                    <Loading boxed={true}/>
                }
            </div>
            </>
            
        )
    }
}

class User extends Component {

    prioritise = (e) => {
        e.preventDefault()
        console.log('prioritising')
        makePostRequest('admin-prioritise', this.props.user.user_sub,
            () => {
                console.log('prioritised!')
            }
        )
    }

    render() {
        var user = this.props.user
        return (
            <div section="user">
                <Link to={{pathname: `/5015db37-0d03-4f44-93a5-606ac215935b/admin/user`, search: `sub=${user.user_sub}`, state: user}} title={user.name} className="user">
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>

                        <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '20px'}}>
                            <div className="medium">
                                {user.name}
                            </div>
                            <div className="small">
                                {user.joined}
                            </div>
                        </div>
                        {
                            user.referral ?
                            <div className="tag">
                                {user.referral}
                            </div>
                            :
                            null
                        }
                        <div>
                            {user.requests ? user.requests[user.requests.length - 1].request : null}
                        </div>
                    </div>

                    <button className="prioritise" onClick={this.prioritise}>
                        Prioritise
                    </button>
                </Link>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        unserved_useruests: state.useruests,
        stylists: state.stylists
    }
}

export default AllUsers = connect(mapStateToProps)(AllUsers)