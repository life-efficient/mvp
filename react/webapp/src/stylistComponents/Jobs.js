import React, { Component } from "react"
import { makeGetRequest } from "../api_calls"
import Section from "../components/Section"
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import Navbar from "./Navbar.js"
import "./Job.css"
import Loading from "../general/Loading"

class Jobs extends Component {
    constructor(props) {
        super(props)
        // this.path = this.props.match.path
        this.state = {
            jobs: null
        }
        var job_prompts = [
            'Save these users from fashion a crisis. Please!',
            'More recommendations = more love',
            'Users need your powers',
            'Work hard, Adla harder',
            'You can do it!'
        ]
        this.prompt = job_prompts[Math.floor(Math.random() * job_prompts.length)]
    }

    componentDidMount = () => {
        console.log('getting jobs')
        makeGetRequest('stylist-jobs',
            (jobs) => {
                jobs = jobs.body
                console.log('CLIENTS:', this.state.jobs)
                var jobs = jobs.sort(
                    (user1, user2) => {
                        if (user1.last_served == null) {
                            return true
                        }
                        if (user2.last_served == null) {
                            return false
                        }
                        return new Date(user2.joined) - new Date(user1.joined)
                    }
                )
                // console.log(users)
                jobs = jobs.map(
                    (job, idx) => {
                        console.log('user:', job)
                        return <Job search={`sub=${job.user_sub}`} user={job} assigned={'yo'} idx={idx}/>
                    }
                )
                console.log('JOBS:', jobs)
                this.setState({jobs})
            }
        )
    }

    render () {
        return (
            <>
                <Navbar back={true}/>
                <div className="body" style={{backgroundColor: '#EA653C'}}>
                    <div className="medium">
                        {this.prompt}
                    </div>
                    {/* <Section to="/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist/user?sub=6f24e417-1523-49b0-90d1-9426499002a0" /> */}
                {
                    this.state.jobs ?
                    this.state.jobs
                    :
                    <div style={{backgroundColor: 'var(--primary)', padding: '10px', width: '40px', borderRadius: '3px', margin: 'auto', marginTop: '10px'}} >
                       <Loading />
                    </div>
                }
                </div>
            </>
        )
    }
}

class Job extends Component {

    takeJob = () => {
        console.log('taking job')
    }

    cancelJob = () => {
        console.log('canceling job')
    }

    getActions = () => {
        //console.log(this.props.clients.includes(this.props.user.user_sub))
       
            return (
                <Link to={{pathname: `/9j3d7w31-lfvl-98je-wewf-p1sbdhjcs636/stylist/user`, search: `?sub=${this.props.user.user_sub}`, state: this.props.user}} search={this.props.search} >
                    <button className="job-btn">
                        Take job
                    </button>
                </Link>
            )
    }

    render() {
        console.log('USER JOB:', this.props.user)
        return (
            <div className="section" style={{animationDelay: `${0.1*this.props.idx}s`}}>
                <div>
                    <div className="section-title">{this.props.user.name}</div>
                    <div className="section-caption">{this.props.user.requests ? this.props.user.requests[this.props.user.requests.length - 1].request : null}</div>
                    <div className="tags" style={{justifyContent: 'left'}}>{this.props.user.styles ? this.props.user.styles.map((style) => {return <div className="tag">{style}</div>}) : null}</div>
                </div>
                {this.getActions()}
            </div>
        )
    }
}
  
const mapStateToProps = (state) => {
    return {
        clients: state.clients
    }
}

Job = connect(mapStateToProps)(Job)

export default Jobs