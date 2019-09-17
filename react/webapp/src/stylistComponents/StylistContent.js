import React, {Component} from "react"
import Section from "../components/Section"
import { Route } from "react-router-dom"
import Navbar from "./Navbar"
import SideNav from "../components/SideNav"
import Client from "./Client"
import Jobs from "./Jobs";
import { Provider } from "react-redux"
import { combineReducers, createStore } from "redux"
import { withRouter } from "react-router"
import Home from "../components/Home"
import { makeGetRequest } from "../api_calls"
import { connect } from "react-redux"
import Modal from "../components/Modal"
import Notification from "../general/Notification"
import Profile from "./Profile"
import FeatureRequest from "./FeatureRequest"
import UserManual from "./UserManual"
import Collections from "./Collections";
import SlideUpPanel from "../components/SlideUpPanel"

const slideUp = (state={open: false, content: null}, action) => {
    switch (action.type) {
        case "OPEN_SLIDEUP":
            console.log('opening slideup')
            return {
                open: true,
                content: action.content
            }
        case "CLOSE_SLIDEUP":
            console.log('closing slideup')
            return {
                open: false,
                content: null
            }
        default:
            return state
    }
}

const modal = (state={open: false, content: null}, action) => {
    switch (action.type) {
        case "OPEN_MODAL": 
            console.log('opening modal')
            return {
                open: true,
                content: action.content
            }
        case "CLOSE_MODAL":
            console.log('closing modal')
            return {
                open: false,
                content: null
            }
        default:
            return state
    }
}

const user = (state={}, action) => {
    // console.log('user:', state)
    // console.log('updating with:', action.user)
    switch (action.type) {
        case "LOG_OUT" :
            console.log('logging out')
            return null
        // case "LOG_IN" :
        //     console.log('logging in')
        //     return {
        //         user_id: action.user_id,
        //         gender: action.gender,
        //         logged_in: true
        //     }
        case "SET_USER":
            console.log('setting user')
            // console.log(action.user)
            return {
                ...state,
                ...action.update,
                brands: action.update.brands ? [...action.update.brands] : [],
                styles: action.update.styles ? [...action.update.styles] : []
            } 
        default:
            return state
    }
}

const sideNav = (state = {open: false}, action) => {
    switch (action.type) {
        case "TOGGLE_SIDENAV" :
            console.log('toggling sidenav')
            return {
                ...state,
                open: !state.open
            }
        default:
            return state
    }
}

const clients = (state = [], action) => {
    switch (action.type) {
        case "SET_CLIENTS":
            console.log('setting clients:', action.clients)
            return action.clients
        default:
            return state
    }
}

const notify = (state={show: false}, action) => {
    switch (action.type) {
        case "NOTIFY":
            console.log('notifying')
            return {
                show: true,
                content: action.content
            }
        case "HIDE_NOTIFY":
            return {
                show: false,
                content: null
            }
        default:
            return state
    }
}

const recs = (state=[], action) => {
    switch (action.type) {
        case "SET_RECS":
            console.log('setting recs')
            return action.recs
        default:
            return state
    }
}

const collections = (state=[], action) => {
    switch (action.type) {
        case "SET_COLLECTIONS":
            console.log('setting collections')
            return {
                collections: action.collections
            }
            default:
                return state
    }
}

const reducer = combineReducers({
    modal,
    slideUp,
    user,
    sideNav,
    // clients,
    notify,
    recs,
    collections
})

export const store = createStore(reducer)

class StylistRoot extends Component {
    constructor(props) {
        super(props)
        this.path = this.props.match.path
        console.log('PATH:', this.path)

        var complements = [
            'You look good today!',
            'You are making people happy',
            'You\'re the best',
            'We want you!',
            'I appreciate you',
            'I love your style',
            'Use your powers!',
            'Make more people happy today!'
        ]
        this.complement = complements[Math.floor(Math.random() * complements.length)]

    }

    render() {
        var sections = [
            {
                to: `${this.path}/jobs`,
                title: "Available jobs"
            },
            {
                to: `${this.path}/profile`,
                title: "My profile"
            },
            {
                to: `${this.path}/user_manual`,
                title: 'About Adla'
            },
        ].map(
            (s, idx) => {
                return <Section to={s.to} title={s.title} caption={s.caption} idx={idx} />
            }
        )

        return (
            <>
                <Navbar />
                <div className="body" style={{backgroundColor: '#C6E0F5'}}>
                    <div className="large">
                        Hey!
                    </div>
                    <br/>
                    <div className="medium">
                        {this.complement}
                    </div>
                    <br/>
                    {sections}
                    {/* <Section to={`${this.path}/collections`} title='My collections' /> */}
                    <FeatureRequest />
                </div>
            </>
        )
    }
}   

const StylistRoutes = (props) => {
    return (
        <>
            <Route path="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist" exact component={StylistRoot} />
            <Route path="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist/user" component={Client}/>
            <Route path="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist/jobs" exact component={Jobs}/>
            <Route path="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist/profile" exact component={Profile}/>
            <Route path="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist/collections" exact component={Collections}/>
            <Route path="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist/user_manual" exact component={UserManual}/>
            {/* <Route path="/" component={Home} /> */}
        </>
    )
}

const StylistContent = () => {
    makeGetRequest('stylist-clients',
        (users) => {
            users = users.body
            users = JSON.parse(users)
            console.log('setting clients:', users)
            store.dispatch({
                type: "SET_CLIENTS",
                clients: users
            })
            //this.setState({clients: users})
        }
    )
    makeGetRequest('stylist-my-info',
        (update) => {
            update = update.body
            console.log(update)
            update = JSON.parse(update)
            console.log('got update info')
            console.log(update)
            store.dispatch({type: 'SET_USER', update})
        }
    )
    makeGetRequest('stylist/recommendations',
        (data) => {
            console.log('MY STYLIST RECOMMENDATIONS:', data)
            data = data.body
            data = JSON.parse(data)
            store.dispatch({type: 'SET_RECS', recs: data})
        }
    )

    return (
        <React.Fragment>
            <Provider store={store}>
                <Notification />
                <SideNav />
                <StylistRoutes />
                <Modal />
                <SlideUpPanel />
            </Provider>
        </React.Fragment>
    )
}

export default (StylistContent)