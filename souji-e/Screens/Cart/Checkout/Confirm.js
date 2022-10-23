import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Button } from "react-native";
import { Text } from "native-base";
import { ListItem } from "react-native-elements";
import Colors from "../../../color";

import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartAction";

const { height, width } = Dimensions.get('window')

const Confirm = (props) => {

    const confirmOrder = () => {
        setTimeout(() => {
            props.clearCart();
            props.navigation.navigate("Cart");
        })
    }

    const confirm  = props.route.params

    return (
        <ScrollView contentContainerStyle={StyleSheet.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.text}>Confirm order</Text>
                {props.route.params ? 
                <View style={{borderWidth:1, }}>
                    <Text style={styles.title}>Shipping to:</Text>
                    <View style={{padding:8}}>
                        <Text>Address1: {confirm.order.order.shippingAddress1}</Text>
                        <Text>Address2: {confirm.order.order.shippingAddress2}</Text>
                        <Text>country: {confirm.order.order.country}</Text>
                        

                    </View>
                    <Text style={styles.title}>Items:</Text>
                    {confirm.order.order.orderItems.map((x) => {
                        return (
                            <ListItem
                                style={styles.listItem}
                                key={x.product.name}
                                >
                                    <View>
                                        <Text>{x.product.name}</Text>
                                    </View>
                                    <View>
                                        <Text>${x.product.price}</Text>
                                    </View>
                                </ListItem>
                        )
                    })}
                    
                </View>
                :null}
                <View style={{alignItems:"center", margin:20 }}>
                    <Button title="Thanh toán" onPress={confirmOrder}/>
                </View>
            </View>

            
        </ScrollView>
    )
}

const mapDispathToProps = (dispatch) => {
    return {
        clearCart: () => dispatch(actions.clearCart())
    }
}

export default connect(null, mapDispathToProps)(Confirm)

const styles = StyleSheet.create({
    container: {
        height: height,
        padding: 8,
        alignItems:"center",
        backgroundColor:Colors.main
    },
    titleContainer:{
        justifyContent:"center",
        alignItems:'center',
        margin:8,
    },
    text: {
        fontSize:20,
        fontWeight:'bold'
    },
    shipping: {

    },
    title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
})