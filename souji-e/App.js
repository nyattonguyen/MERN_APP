import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider} from "native-base";
import { StyleSheet, View } from "react-native"
import ProductContainer from "./Screens/Products/ProductContainer";

// import Header from "./Shared/Header"

//Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

//Navigators
import Main from "./Navigators/Main";

const App = () =>{
    return (
      <Provider store={store}>
      <NativeBaseProvider style = {styles.container}>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </NativeBaseProvider>
      </Provider>
    )
}
export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent:"center",
    justifyContent:"center"
  }
})