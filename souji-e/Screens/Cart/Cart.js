import { Center, Container, Text, Box } from "native-base";
import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/FontAwesome";

import { block } from "react-native-reanimated";
import Colors from "../../color";

import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartAction";
import CartItem from "./CartItem";

var { height, width } = Dimensions.get("window");

const Cart = (props) => {
  var total = 0;
  props.cartItems.forEach((cart) => {
    return (total += cart.product.price);
  });

  return (
    <>
      {props.cartItems.length ? (
        <Container>
          <SwipeListView
            data={props.cartItems}
            renderItem={(data) => <CartItem item={data} />}
            renderHiddenItem={(data) => (
              <View style={styles.hiddenContainer}>
                <TouchableOpacity
                  style={styles.hiddenButton}
                  onPress={() => props.removeFromCart(data.item)}
                >
                  <Icon name="trash" color={Colors.white} size={30} />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe={true}
            previewOpenDelay={3000}
            friction={1000}
            tension={40}
            leftOpenValue={75}
            stopLeftSwipe={75}
            rightOpenValue={-75}
            style={styles.swipe}
          />
          <View style={styles.bottomContainer}>
            <View>
              <Text style={styles.price}>{total}vnd</Text>
            </View>
            <View style={styles.ml5}>
              <Button title="Clear" onPress={() => props.clearCart()} />
            </View>
            <View style={styles.ml5}>
              <Button
                title="Checkout"
                onPress={() => props.navigation.navigate("Checkout")}
              />
            </View>
          </View>
        </Container>
      ) : (
        <Container >
          <Center style={styles.emptyContainer}>
            <Text style={styles.center}>Để không gian thoải mái hơn</Text>
            <TouchableOpacity style={styles.button}
                            onPress={() => props.navigation.navigate("Home")}
                >
                    <Text color={Colors.white}>Đăng việc</Text>
                </TouchableOpacity>
          </Center>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },
  body: {
    width: width,
    alignContent: "space-between",
  },
  bottomContainer: {
    width: width,
    flexDirection: "row",
    position: "relative",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    elevation: 20,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.subGreen,
  },
  price: {
    fontSize: 18,
    margin: 20,
    color: Colors.red,
  },
  ml5: {
    marginLeft: 5,
    marginRight: 3,
  },
  hiddenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  hiddenButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
    height: 70,
    width: width / 1.2,
  },
  swipe: {
    width: width,
  },

  button: {
    alignItems: "center",
    fontSize: 18,
    marginTop: 20,
    fontWeight:'500',
    backgroundColor: Colors.black,
    color: Colors.white,
    padding: 6,
    borderRadius:6,
  },
});
