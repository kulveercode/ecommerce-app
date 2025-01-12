import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartReducer";

const ProductInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 100;
  const [addedToCart, setAddedToCart] = useState(false);

  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);

  return (
    <>
      <ScrollView
        style={{ marginTop: 5, flex: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View
          style={{
            backgroundColor: "#00CED1",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              flex: 1,
              backgroundColor: "white",
              alignItems: "center",
              marginHorizontal: 7,
              gap: 10,
              borderRadius: 3,
              height: 38,
            }}
          >
            <AntDesign
              name="search1"
              size={22}
              color="black"
              style={{ paddingLeft: 10 }}
            />
            <TextInput placeholder="Search.." />
          </Pressable>
          <Feather name="mic" size={24} color="black" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {route.params.carouselImages.map((item, index) => (
            <ImageBackground
              style={{ width, height, marginTop: 25, resizeMode: "contain" }}
              source={{ uri: item }}
              key={index}
            >
              <View
                style={{
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* discount  */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#C60C30",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    20% off
                  </Text>
                </View>
                {/* share icon  */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={24}
                    color="black"
                  />
                </View>
              </View>
              {/* heart  */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 20,
                  marginBottom: 20,
                  marginTop: "auto",
                }}
              >
                <AntDesign name="hearto" size={24} color="black" />{" "}
              </View>
            </ImageBackground>
          ))}
        </ScrollView>
        {/* other details  */}
        {/* price  */}
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            {route?.params.title}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>
            ₹{route?.params.price}
          </Text>
        </View>
        <Text style={{ height: 1, borderWidth: 1, borderColor: "#D0D0D0" }} />
        {/* color  */}
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <Text>Color:</Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {route?.params.color}
          </Text>
        </View>
        {/* size  */}
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <Text>Size:</Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {route?.params.size}
          </Text>
        </View>
        <Text style={{ height: 1, borderWidth: 1, borderColor: "#D0D0D0" }} />
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
            Total Price: ₹{route?.params?.price}
          </Text>
          <Text style={{ color: "#00CED1" }}>
            Free Delivery Tomorrow by 3PM, If order within 10hrs 30min
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
              gap: 5,
            }}
          >
            <Ionicons name="location" size={24} color="black" />
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              Deliver to Kulveer - Dehradun 248001
            </Text>
          </View>
        </View>
        <Text
          style={{ color: "green", fontWeight: "500", marginHorizontal: 10 }}
        >
          IN Stock
        </Text>
        {/* Buttons  */}
        <Pressable
          onPress={() => addItemToCart(route?.params?.item)}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          {addedToCart ? (
            <View>
              <Text>Added to Cart</Text>
            </View>
          ) : (
            <Text>Add to Cart</Text>
          )}
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#FFAC1C",
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text>Buy now</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({});
