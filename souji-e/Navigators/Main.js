import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Stacks
import HomeNav from "./HomeNav";
import CartNav from "./CartNav";
import CartIcon from "../Shared/CartIcon";
import Colors from "../color";
// import UserNav from "./UserNav";
// import AdminNav from "./AdminNav";

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard:true,
        tabBarShowLabel:false,
        tabBarActiveTintColor:Colors.main
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNav}
        options={{
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNav}

        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome5 name="clipboard-list" color={color} size={30} />
              <CartIcon />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Admin"
        component={HomeNav}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="cog" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="User"
        component={HomeNav}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
