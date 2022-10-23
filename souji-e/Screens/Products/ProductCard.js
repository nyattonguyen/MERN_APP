import React from 'react'
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    Text,
    Button
} from 'react-native'
// import EasyButton from "../../Shared/StyledComponents/EasyButton"

import { connect } from 'react-redux';
import * as actions from "../../Redux/Actions/cartAction";


var { width } = Dimensions.get('window')

const ProductCard = (props) => {
    const { name, price, countInStock } = props;

    return (
        <View style={styles.container}>
            
            <View style={styles.card}>
            <Text style={styles.title}> 
                {name}              
            </Text>
            <Text style={styles.price}>${price}</Text>

           </View>
           <View>
                <Button 
                    onPress={() => {
                        props.addItemToCart(props)
                    }}
                >Add</Button>
           </View>
        </View>
    )
}

const mapStateToProps = (dispatch) => {
    return {
        addItemToCart: (product) => 
            dispatch(actions.addToCart({ quanlity: 1, product}))
    }
}



const styles = StyleSheet.create({
    container: {
        width: width-25,
        height: "full",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: 'white',
    },
    
    card: {
        marginBottom: 10,
        height: 65,
        backgroundColor: 'transparent',
        width: width-60,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        textAlign: 'center'
    },
    price: {
        fontSize: 20,
        color: 'orange',
        marginTop: 10,
        textAlign:"center"
    }
})

export default connect(null, mapStateToProps)(ProductCard);