import React, { Component } from "react"
import { Link } from "react-router-dom"
import "./Index.css"
import Button from "../components/Button"
import { connect } from "react-redux"
// import { Analytics } from "aws-amplify";
import Navbar from "./Navbar"
import LineChart from "../components/Chart"
import Tabs from "../general/Tabs";
// import data from "../data/data_out"


const useScroll = () => {
    const ref = React.useRef(null)
    const executeScroll = () => {
        window.scrollTo(0, ref.current.offsetTop)
    }
    const htmlElementAttributes= {ref}

    return [executeScroll, htmlElementAttributes]
}

// class Home extends Component {
    // constructor(props){
    //     super(props)
    //     this.state = {animate: ''}
    // }

    // componentDidMount = () => {
    //     console.log(window.location.host)
    //     if (!(window.location.host == 'localhost:3000')) {
    //         console.log('trac')
    //         window.analytics.page('landing')
    //     }
    //     this.scroll = Scroll.animateScroll;
    // }

    // componentWillUnmount = () => {
    //     this.setState({animate: 'roll-out'})
    // }

    // render() {
class Home extends Component{
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }
    componentDidMount = () => {
        var from = 1483228800.0.toString()
        var to = new Date().getTime().toString()
        console.log(to)
        console.log(from)
        console.log(typeof(to))
        fetch(`https://dihwh38uwi.execute-api.eu-west-2.amazonaws.com/prod/data?_from=${from}&to=${to}`)
        .then(
            data => {
                // console.log(data)
                data = data.json()
                // console.log(data)
                return data
            }
        )
        .then(
            data => {
                console.log(data)
                data = JSON.parse(data)
                this.setState({data})
            }
        )
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
            {/* <Tabs tabs={tabs} top={true} /> */}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {/* //, backgroundColor: 'black', height: '100vh'}}> */}
                {
                    this.state.data!=null ?
                        ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'].map(
                            (d, idx) => {
                                return (<LineChart title={d} data={this.state.data[d]} idx={idx}/>)
                            }
                        )
                    :
                    null
                }
            </div>
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