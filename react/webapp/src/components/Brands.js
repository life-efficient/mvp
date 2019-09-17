import React, { Component } from "react"
//import { Route, Link } from "react-router-dom"
import { Redirect } from "react-router-dom"
import "./store.css"
import "./Brands.css"
import { Auth } from "aws-amplify"
import { connect } from "react-redux"
// import { updateUserDetails } from "../api_calls"
import Navbar from "./Navbar"
import { makePostRequest } from "../api_calls";
import sendIcon from "../images/icons/send.svg"
import Loading from "../general/Loading"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../images/brands', false, /\.(png|jpe?g|svg)$/));

class BrandBtn extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.liked)
        this.state = {
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps !== this.props) {
            this.setState({liked: this.props.liked})
        }
    }

    componentDidMount = () => {
        this.setState({liked: this.props.liked})
    }
    
    handleClick = () => {
        this.setState({liked: !this.state.liked}, () => {
            this.props.toggleLike(this.props.brand, this.state.liked)
        })
    }

    render() {
        //console.log(this.props.brand, 'is liked?', this.state.liked)
        return (
            <React.Fragment>
                <input id={this.props.brand} className="radio_btn" type="radio" checked={this.state.liked} />
                <label for={this.props.brand} className="quiz_option brand_label" onClick={this.handleClick}>
                    <img src={this.props.img} alt=""/>
                </label>
            </React.Fragment>
        )
    }
}

class Brands extends Component {
    constructor(props) {
        super(props)
        // GET ICONS BY RUNNING PYTHON FILE OUTPUT_BRAND_ICONS.PY IN WEBAPP AND THEN COPYING BRAND_ICONS.JS  
        this.icons = ["images/brands/champion.png", "images/brands/alyx.jpg", "images/brands/supreme.png", "images/brands/forever_21.png", "images/brands/allsaints.png", "images/brands/oh_polly.png", "images/brands/helmut_lang.png", "images/brands/princess_polly.png", "images/brands/chanel.png", "images/brands/vesper.png", "images/brands/yeezy.png", "images/brands/vans.png", "images/brands/shein.png", "images/brands/bec_and_bridge.png", "images/brands/balenciaga.jpg", "images/brands/levis.png", "images/brands/dollskill.jpeg", "images/brands/moon_river.jpg", "images/brands/&_other_stories.png", "images/brands/acne_studios.png", "images/brands/american_apparel.png", "images/brands/moschino.png", "images/brands/calvin_klein.png", "images/brands/nike.jpg", "images/brands/primark.png", "images/brands/tommy_hilfiger.png", "images/brands/unif.png", "images/brands/faithfull.png", "images/brands/bershka.png", "images/brands/pacsun.png", "images/brands/goodhood.png", "images/brands/valfre.png", "images/brands/axel_arigato.png", "images/brands/580b57fcd9996e24bc43c4f2.png", "images/brands/o_mighty.jpg", "images/brands/comme-des-garcons.png", "images/brands/lacoste.png", "images/brands/urban_outfitters.png", "images/brands/monki.png", "images/brands/minga.png", "images/brands/margiela.png", "images/brands/reformation.png", "images/brands/zara.png", "images/brands/boohoo.png", "images/brands/The Ragged Priest.png", "images/brands/realisation_par.png", "images/brands/for_love_of_lemons.png", "images/brands/gymshark.png", "images/brands/ralph_lauren.png", "images/brands/lululemon.jpg", "images/brands/h&m.png", "images/brands/pull_and_bear.png", "images/brands/american_eagle.png", "images/brands/topshop.png", "images/brands/never_fully_dressed.png", "images/brands/asos.png", "images/brands/gucci.png", "images/brands/steve_madden.svg", "images/brands/calvin_klein.jpg"]
        // this.icons = this.shuffle(this.icons)
        this.state = {
            allBrands: this.icons,
            ready: true,
            btns: [],
            // brands: []
        }
    }

    // componentDidUpdate = () => {
    //     console.log(this.props.styles)
    //     console.log(this.state.styles)
    //     if (this.props.styles && this.state.styles != this.props.styles) {      // if style props passed and state is not equal
    //         this.setState({styles: this.props.styles})                          // equate the styles
    //     }
    // }

    handleOptionChange = (e) => {
        // console.log(e.target)
        // console.log(e.target.id)
        // console.log(this.props.brands.includes(e.target.id))
        console.log(this.state.brands)
        var brands = this.props.brands
        console.log('BRAND:', e)
        if (brands.includes(e.target.id)) {
            console.log('removing brand')
            brands = brands.filter( (item) => {return item != e.target.id} )
        }
        else {
            console.log('adding brand')
            brands.push(e.target.id)
        }
        this.props.onChange(brands)
    }

    handleRequestChange = (e) => {
        this.setState({request: e.target.value},
            () => {console.log(this.state)}    
        )
    }

    submitRequest = () => {
        var request = this.state.request.toLowerCase()
        if (request != '') {
          
            this.setState({
                request: ''
                // request_loading: true
            })
            this.handleOptionChange({target: {id: request}})
            makePostRequest('feature-request', {type: 'new brand request', request: request},
                () => {
                    console.log('brand requested')
                }
            )
        }
    }

    render() {
        console.log('PROPS:', this.props)
        console.log('BRANDS:', this.props.brands)
        var brands = this.props.brands
        var allBrands = this.state.allBrands
        return (
            <div className="panel">
                <div className="medium">
                    Brands you love
                </div>
                <div className="" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', height: '60vh', overflowY: 'scroll'}}>
                    {
                        allBrands
                        .sort(
                            (b1, b2) => {
                                b1 = b1.split('.')[0].split('/').pop()
                                b2 = b2.split('.')[0].split('/').pop()
                                if (b1 > b2) {return 1}
                                if (b2 > b1) {return -1}
                            }
                        )
                        .map(
                            (item) => {
                                // console.log(item)
                                var brand = item.split('.')[0].split('/').pop()
                                var img = item.split('/').slice(-1)
                                console.log(this.props.brands.includes(brand))
                                var opacity = brands.includes(brand) ? '1' : '0.5'
                                
                                return <>
                                    <label for={brand} onClick={this.handleOptionChange} style={{opacity}} value={brands.includes(item)}>
                                        <button id={brand} className="brand_label img_btn" >
                                            <input className="radio_btn" type="radio" checked={brands.includes(brand)} />
                                            <img id={brand} src={images[img]} alt=""/>
                                        </button>
                                    </label>
                                </>
                            }
                        )
                    }
                </div>
                <div style={{marginTop: '30px'}}>
                    <div><strong>Enter your own brand!</strong></div>
                    <div className="searchbar">
                        <input value={this.state.request} onChange={this.handleRequestChange} className="text-response" placeholder='Enter a missing brand...' style={{fontSize: '13px'}} />
                        <button onClick={this.submitRequest}>
                            {
                                this.state.request_loading ?
                                <Loading />
                                :
                                <img src={sendIcon} brand={{height: '30px'}} />
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
        brands: state.user.brands ? state.user.brands : []
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (update) => {
            console.log(update)
            console.log(window.endpoint_prefix)
            makePostRequest(`${window.endpoint_prefix}/details`, {brands: update},
                () => {console.log('brands updated')}
            )
            dispatch({
                type:"SET_USER",
                update: {brands: update}
            })
        }
    }
}

    // shuffle = (arr) => {
    //     var j, x, i;
    //     for (i = arr.length - 1; i > 0; i--) {
    //         j = Math.floor(Math.random() * (i + 1));
    //         x = arr[i];
    //         arr[i] = arr[j];
    //         arr[j] = x;
    //     }
    //     return arr;
    // }
//     componentDidUpdate = () => {
//         console.log(this.props.brands)
//         console.log(this.state.brands)
//         if (this.props.brands && this.state.brands != this.props.brands) {      // if brand props passed and state is not equal
//             this.setState({brands: this.props.brands})                          // equate the brands
//         }
//     }

//     componentDidMount = () => {
//         window.analytics.page('brands')
//     }

//     componentDidUpdate(prevProps){
//         console.log('checking did update')
//         console.log(prevProps.brands)
//         console.log(this.props.brands)
//         if(prevProps.brands !== this.props.brands){ 
//             makePostRequest('user-info', {brands: this.props.brands},
//                 () => {
//                     console.log('yo')
//                 }
//             )
//         }
//     }

//     toggleLike = (brand) => {
//         console.log('toggling')
//         if (this.props.brands.includes(brand)) {
//             this.props.unlikeBrand(brand)
//             window.analytics.track('brand unliked', {brand: brand})
//         }
//         else {
//             this.props.likeBrand(brand)
//             window.analytics.track('brand liked', {brand: brand})
//         }
//     }

//     getBtns = (icons) => {
//         console.log('getting btns')
//         var btns = icons.map(
//             icon => {
//                 var brand = icon.split('.')[0].split('/').pop()
//                 var img = icon.split('/').slice(-1)
//                 //var liked = this.state.liked.includes(brand)
//                 var liked = this.props.brands.includes(brand)
//                 console.log('BRAND', brand, 'LIKED:', liked)
//                 return (<BrandBtn img={images[img]} brand={brand} liked={liked} toggleLike={this.toggleLike}/>)
//             }
//         )
//         return btns
//     }

//     render() {
//         console.log('brands from redux:', this.props.brands)
//         return (
//             <>
//             <Navbar back={true} />
//             <div className="body brands-body" brand={{backgroundColor: '#BCA2F2'}}>
//                 <div className="panel-title">Brands you love</div>
//                 <div className="small">Select any brands that you love</div>
//                 <div className="small">Here's some of the most popular to start with</div>
//                 <div className="grid-response" id="brands">
//                     {this.getBtns(this.icons)}
//                 </div>
//                 {/*<input className="text-response not-required extra-detail" id="custom_brands_i_love" placeholder="Any others?" />*/}
//                 {/*
//                 <div className="brands-searchbar-container">
//                     <div className="brands-searchbar-panel">
//                         <input className="brands-searchbar" />
//                         <div className="brands-search-icon">s</div>
//                     </div>
//                 </div>
//                 */}
//             </div>
//             </>
//         )
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         likeBrand: (brand) => {
//             console.log('liking')
//             dispatch({
//                 type: "LIKE_BRAND",
//                 brand: brand
//             })
//         },
//         unlikeBrand: (brand) => {
//             console.log('unliking brand')
//             dispatch({
//                 type: "UNLIKE_BRAND",
//                 brand: brand
//             })
//         }
//     }
// }

// const mapStateToprops = (state) => {
//     console.log(state.user)
//     return {
//         brands: state.user.brands ? state.user.brands : [],
//     }
// }

export default Brands = connect(mapStateToProps, mapDispatchToProps)(Brands) 