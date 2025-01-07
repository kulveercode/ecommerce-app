import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Carousel from "react-native-reanimated-carousel";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "expo-router";
import data from "../data/data.json";
import { useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "@/UserContext";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const list = [
  {
    id: "0",
    image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
    name: "Home",
  },
  {
    id: "1",
    image:
      "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
    name: "Deals",
  },
  {
    id: "3",
    image:
      "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
    name: "Electronics",
  },
  {
    id: "4",
    image:
      "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
    name: "Mobiles",
  },
  {
    id: "5",
    image:
      "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
    name: "Music",
  },
  {
    id: "6",
    image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
    name: "Fashion",
  },
];
const images = [
  "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
  "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
  "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
];
const deals = [
  {
    id: "20",
    title: "OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)",
    oldPrice: 25000,
    price: 19000,
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/wireless_products/ssserene/weblab_wf/xcm_banners_2022_in_bau_wireless_dec_580x800_once3l_v2_580x800_in-en.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg",
      "https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg",
    ],
    color: "Stellar Green",
    size: "6 GB RAM 128GB Storage",
  },
  {
    id: "30",
    title:
      "Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers",
    oldPrice: 74000,
    price: 26000,
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungBAU/S20FE/GW/June23/BAU-27thJune/xcm_banners_2022_in_bau_wireless_dec_s20fe-rv51_580x800_in-en.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg",
      "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
    ],
    color: "Cloud Navy",
    size: "8 GB RAM 128GB Storage",
  },
  {
    id: "40",
    title:
      "Samsung Galaxy M14 5G (ICY Silver, 4GB, 128GB Storage) | 50MP Triple Cam | 6000 mAh Battery | 5nm Octa-Core Processor | Android 13 | Without Charger",
    oldPrice: 16000,
    price: 14000,
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/CatPage/Tiles/June/xcm_banners_m14_5g_rv1_580x800_in-en.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/817WWpaFo1L._SX679_.jpg",
      "https://m.media-amazon.com/images/I/81KkF-GngHL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61IrdBaOhbL._SX679_.jpg",
    ],
    color: "Icy Silver",
    size: "6 GB RAM 64GB Storage",
  },
  {
    id: "41",
    title:
      "realme narzo N55 (Prime Blue, 4GB+64GB) 33W Segment Fastest Charging | Super High-res 64MP Primary AI Camera",
    oldPrice: 12999,
    price: 10999,
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/tiyesum/N55/June/xcm_banners_2022_in_bau_wireless_dec_580x800_v1-n55-marchv2-mayv3-v4_580x800_in-en.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61og60CnGlL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61twx1OjYdL._SX679_.jpg",
    ],
  },
];
const offers = [
  {
    id: "0",
    title:
      "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
    offer: "72%",
    oldPrice: 7500,
    price: 4500,
    image:
      "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
    ],
    color: "Green",
    size: "Normal",
  },
  {
    id: "1",
    title:
      "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
    offer: "40%",
    oldPrice: 7955,
    price: 3495,
    image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
    ],
    color: "black",
    size: "Normal",
  },
  {
    id: "2",
    title: "Aishwariya System On Ear Wireless On Ear Bluetooth Headphones",
    offer: "40%",
    oldPrice: 7955,
    price: 3495,
    image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
    carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
    color: "black",
    size: "Normal",
  },
  {
    id: "3",
    title:
      "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
    offer: "40%",
    oldPrice: 24999,
    price: 19999,
    image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
    ],
    color: "Norway Blue",
    size: "8GB RAM, 128GB Storage",
  },
];

const HomeScreen = () => {
  const width = Dimensions.get("window").width;
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchData = async () => {
      // try {
      //   const response = await axios.get("https://fakestoreapi.com/products");
      //   setProducts(response.data);
      // } catch (error) {
      //   console.log(error);
      // }
      setProducts(data);
    };
    fetchData();
  }, []);
  console.log("products", products);

  //filter
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (products) => products.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);

  //addresses
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  const fetchAddresses = async () => {
    // Fetch addresses from API
    try {
      const response = await axios.get(
        `http://192.168.31.231:8000/addresses/${userId}`
      );
      const addresses = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Token retrieved:", token);
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    fetchUser();
  }, [setUserId]);

  console.log("addresses:", addresses);
  return (
    <>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 0 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ScrollView>
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
          {/* Location */}
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              gap: 5,
              backgroundColor: "#AFEEEE",
            }}
          >
            <Ionicons name="location-outline" size={24} color="black" />
            <Pressable>
              {/* {selectedAddress ? (
                <Text>Deliver to {selectedAddress?.name} - {selectedAddress?.street}</Text>
              ) : (
                <Text style={{fontSize:13, fontWeight:"500"}}>Add a Address</Text>
              )} */}
              <Text style={{ fontSize: 13, fontWeight: "500" }}>
                Deliver to Kulveer - Dehradun 248001
              </Text>
            </Pressable>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>
          {/* List */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <Pressable
                key={item.id || index}
                style={{
                  margin: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 50, height: 50, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  {item?.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          {/* Carousel */}
          <View style={{ flex: 1 }}>
            <Carousel
              loop
              width={width}
              height={width / 2}
              autoPlay={true}
              data={images}
              scrollAnimationDuration={1000}
              // onSnapToItem={(index) => console.log('current index:', index)}
              renderItem={({ index }) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: images[index] }}
                    style={{ width: width, height: width / 2 }}
                  />
                </View>
              )}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Trending Deals of the week
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {deals.map((item, index) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  });
                }}
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                key={item.id || index}
              >
                <Image
                  style={{ width: 180, height: 180, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
              </Pressable>
            ))}
          </View>
          {/* border  */}
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          {/* Today's Deals */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Today's Deals
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((item, index) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  });
                }}
                key={item.id || index}
                style={{
                  marginVertical: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <Image
                  style={{ width: "100%", height: 180, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
                <View
                  style={{
                    backgroundColor: "#E31837",
                    paddingVertical: 5,
                    width: 130,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 13,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Upto {item?.offer} off
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          {/* border  */}
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          {/* dropdown picker  */}
          <View
            style={{
              marginHorizontal: 10,
              width: "45%",
              marginbottom: 15,
            }}
          >
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Men's Clothing" value="men's clothing" />
              <Picker.Item label="Women's Clothing" value="women's clothing" />
              <Picker.Item label="Jewelery" value="jewelery" />
              <Picker.Item label="Electronics" value="electronics" />
            </Picker>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {filteredProducts?.map((item, index) => (
              <ProductItem item={item} key={index} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* modals  */}
      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose you Location
            </Text>
            <Text style={{ fontSize: 16, marginTop: 5, color: "gray" }}>
              Select a delivery location to see Product availability
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added location  */}
            <Pressable
            // onPress={() => setSelectedAddress(item)}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                margin: 3,
                marginRight: 13,
                marginTop: 10,
                // backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Kulveer Singh
                </Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>
              <Text
                numberOfLines={1}
                style={{ width: 130, fontSize: 13, textAlign: "center" }}
              >
                #56, Near axis Bank, Clemin town, Dehradun
              </Text>
              <Text
                numberOfLines={1}
                style={{ width: 130, fontSize: 13, textAlign: "center" }}
              >
                Uttarakhand, 248001
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                paddingTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0062B2",
                  fontWeight: "500",
                }}
              >
                Add an address or pickup point
              </Text>
            </Pressable>
          </ScrollView>
          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0062B2" />
              <Text style={{ fontWeight: "400", color: "#0062B2" }}>
                Enter PinCode
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <MaterialIcons
                name="location-searching"
                size={22}
                color="#0062B2"
              />
              <Text style={{ fontWeight: "400", color: "#0062B2" }}>
                Use My Current Location
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
