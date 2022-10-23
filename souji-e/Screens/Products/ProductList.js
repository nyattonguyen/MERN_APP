import { ScrollView } from 'native-base';
import React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';

import ProductCard from './ProductCard'

var { width } = Dimensions.get("window");

const ProductList = (props) => {
    const { item } = props;
    return(
        <ScrollView showsVerticalScrollIndicator={true}>
            <TouchableOpacity 
            style={{ width: '80%' }}
            onPress={() => 
                props.navigation.navigate("Product Detail", { item: item})
        }
        >
            <View style={{ width: width, 
                backgroundColor: 'gainsboro'}}
        >
            <ProductCard {...item} />
            </View>
        </TouchableOpacity>
        </ScrollView>
    )
}

export default ProductList;