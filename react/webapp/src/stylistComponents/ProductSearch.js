import React, { Component } from "react"
import Searchbar from "../general/Searchbar"
import PotentialRecommendation from "./PotentialRecommendation"

class ProductSearch extends Component {

    filter = (result) => {
        var v = this.props.user.price_range.match(/\d+/g)[0]
        v =  v > result.price

        return v
    }

    mapResults = (item) => {
        console.log(item)
        return <PotentialRecommendation rec={item}/>
    }

    render() {
        return (
            <Searchbar endpoint={'stylist/product-search'} map={this.mapResults} filter={this.filter} prompt='Search for products...'/>
        )
    }
}

export default ProductSearch