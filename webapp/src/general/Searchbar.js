import React, { Component } from "react"
import "./Searchbar.css"
import searchIcon from "../images/icons/search.png"
import Loading from "./Loading";
import { makePostRequest } from "../api_calls"
import User from "./User"

class Searchbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            results: null,
            map: (item) => {return item}
        }
    }

    handleChange = (e) => {
        this.setState({search: e.target.value},
            () => {
                console.log(this.state)
            }    
        )
    }

    search = () => {
        this.setState({loading: true})
        makePostRequest(this.props.endpoint, this.state,
            (response) => {
                response = response.json()
                .then(
                    (results) => {
                        console.log(results)
                        // results = results.body
                        // console.log(results)
                        // results = JSON.parse(results)
                        console.log('search results:', results)
                        if (this.props.filter) {
                            results = results.filter(
                                this.props.filter
                            )
                        }
                        
                        this.setState({results, loading: false},
                            () => console.log('searchbar state:', this.state)
                        )
                    }
                )
                .catch(
                    () => this.setState({loading: false})
                )
            }
        )
    }

    render() {
        return (
            <>
            <div className="searchbar-container">
                <div className="searchbar">
                    <input value={this.state.search} onChange={this.handleChange} placeholder={this.props.prompt}/>
                    <button onClick={this.search}>
                        {
                            this.state.loading ?
                            <Loading />
                            :
                            <img src={searchIcon} />
                        }
                        
                    </button>
                </div>
                <div className="results potential-recs">
                    {
                        this.state.results ?
                            this.state.results.length > 0 ? 
                            this.state.results.map(
                                this.props.map
                            )
                            :
                            <div style={{width: '100%', fontFamily: 'var(--font1)'}} >
                                No results found :(
                                <br/>
                                Cmon I only built this today
                            </div>
                            
                        :
                        null
                    }
                </div>
            </div>
            </>
        )
    }
}

export default Searchbar