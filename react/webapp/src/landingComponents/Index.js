import React, { Component } from "react"
import "./Index.css"
import { connect } from "react-redux"

class Home extends Component{
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }

    render() {
        var tabs = [
            {
                'name': 'dist over days',
                'to': '/posts_by_wkday'
            },
            {
                'name': 'Student stats',
                'to': '/student_stats'
            }
        ]
        if (this.state.data) {
            console.log(this.state.data)
        }
        return (
            <>
           </>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        logged_in: state.user.logged_in
    }
}

export default Home = connect(mapStateToProps)(Home)