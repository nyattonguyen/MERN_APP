import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { Container, ScrollView } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

// import baseURL from "../../assets/common/baseUrl";
// import axios from "axios";

import ProductList from "./ProductList";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import Header from "../../Shared/Header";





var { height, width } = Dimensions.get("window");
const data = require("../../assets/data/products.json");
const productCategories = require("../../assets/data/categories.json");

const ProductContainer = (props) => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategory] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(data);
    setProductsFiltered(data);
    setProductsCtg(data);
    setInitialState(data);
    setFocus(false);
    setCategory(productCategories);
    setActive(-1);
    // setLoading(false);
    //products
    // axios
    // .get(`${baseURL}products`)
    // .then((res) => {
    //   setProducts(res.data);
    //   setProductsFiltered(res.data);
    //   setProductsCtg(res.data);
    //   setInitialState(res.data);
    // }).catch((error) => {
    //   console.log('Api call error:', error)
    // })


    return () => {
      setProducts([]);
      setProductsFiltered([]);
      setFocus();
      setCategory([]);
      setActive();
      setInitialState();
    };
  });

  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };
  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter((i) => i.category.$oid === ctg),
              setActive(true)
            ),
          ];
    }
  };

  return (
    <View>
      <Header />
      <Container>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={styles.container}>
            <Banner />
          </View>
          <View>
            <CategoryFilter
              categories={categories}
              categoryFilter={changeCtg}
              productsCtg={productsCtg}
              active={active}
              setActive={setActive}
            />
          </View>

          {productsCtg.length > 0 ? (
            <View style={styles.listContainer}>
              {productsCtg.map((item) => {
                return (
                  <ProductList
                    navigation={props.navigation}
                    key={item._id.$oid}
                    item={item}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.center}>No products found</Text>
            </View>
          )}
        </ScrollView>
      </Container>
    </View>
  );
};
export default ProductContainer;

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    height: height,
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "column",
    backgroundColor: "gainsboro",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
