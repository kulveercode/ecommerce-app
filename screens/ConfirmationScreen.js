import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "@/UserContext";
import axios from "axios";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "@/redux/CartReducer";
import { useNavigation } from "expo-router";
import RazorpayCheckout from "react-native-razorpay";

const ConfirmationScreen = () => {
  const steps = [
    { title: "Address", content: "Address form" },
    { title: "Delivery", content: "Delivery form" },
    { title: "Payment", content: "Payment details" },
    { title: "Place Order", content: "Order summary" },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [option, setOption] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  useEffect(() => {
    fetchAddresses();
  });

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
  console.log(addresses);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
      };

      const response = await axios.post(
        "http://192.168.31.231:8000/orders",
        orderData
      );
      if (response.status === 200) {
        dispatch({ type: "CLEAR_CART" });
        navigation.navigate("Order");
        dispatch(cleanCart());
        console.log("order created successfully", response.data.order);
      } else {
        Alert.alert("Error", "Failed to place order");
        console.log("error placing order", response.data.order);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //raozorpayment
  const pay = async () => {
    try {
      const options = {
        description: "Adding to wallet",
        currency: "INR",
        name: "ecommerce-app",
        key: "rzp_test_pAWtWZnNC01evS",
        amount: total * 100,
        prefill: {
          name: "ecommerce-app",
          email: "kulveer.dev",
          phone_number: "7017078186",
        },
        theme: { color: "#F37254" },
      };
      const data = await RazorpayCheckout.open(options);

      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: card,
      };

      const response = await axios.post(
        "http://192.168.31.231:8000/orders",
        orderData
      );
      if (response.status === 200) {
        dispatch({ type: "CLEAR_CART" });
        navigation.navigate("Order");
        dispatch(cleanCart());
        console.log("order created successfully", response.data.order);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 5 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          {steps?.map((step, index) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {index > 0 && (
                <View
                  key={index}
                  style={[
                    { flex: 1, height: 2, backgroundColor: "green" },
                    index <= currentStep && { backgroundColor: "green" },
                  ]}
                />
              )}
              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    backgroundColor: "#ccc",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  index < currentStep && { backgroundColor: "green" },
                ]}
              >
                {index < currentStep ? (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={{ textAlign: "center", marginTop: 8 }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {currentStep == 0 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Select Delivery Address
          </Text>
          <Pressable>
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingBottom: 17,
                marginVertical: 7,
                borderRadius: 6,
              }}
            >
              {selectedAddress && selectedAddress._id === item?._id ? (
                <FontAwesome5 name="dot-circle" size={20} color="#008397" />
              ) : (
                <Entypo
                  onPress={() => setSelectedAddress(item)}
                  name="circle"
                  size={20}
                  color="gray"
                />
              )}
              <View style={{ marginLeft: 6 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Kulveer Singh
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>
                <Text style={{ fontSize: 15, color: "#181818" }}>
                  #56, Near axis Bank
                </Text>
                <Text style={{ fontSize: 15, color: "#181818" }}>
                  Clemin town, Dehradun
                </Text>
                <Text style={{ fontSize: 15, color: "#181818" }}>
                  Uttarakhand, 248001
                </Text>
                <Text style={{ fontSize: 15, color: "#181818" }}>
                  Phone no - 9897969501
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 7,
                  }}
                >
                  <Pressable
                    style={{
                      borderColor: "#D0D0D0",
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      paddingVertical: 6,
                      borderWidth: 0.9,
                    }}
                  >
                    <Text>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={{
                      borderColor: "#D0D0D0",
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      paddingVertical: 6,
                      borderWidth: 0.9,
                    }}
                  >
                    <Text>remove</Text>
                  </Pressable>
                  <Pressable
                    style={{
                      borderColor: "#D0D0D0",
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      paddingVertical: 6,
                      borderWidth: 0.9,
                    }}
                  >
                    <Text>Set as Default</Text>
                  </Pressable>
                </View>
                <View>
                  {/* {selectedAddress && selectedAddress._id === item?._id && ()} */}
                  <Pressable
                    onPress={() => setCurrentStep(1)}
                    style={{
                      backgroundColor: "#FFC72C",
                      padding: 10,
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>
                      Deliver to this address
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </View>
      )}

      {/* current step - 1 */}
      {currentStep == 1 && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            choose your delivery options
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 8,
              gap: 7,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {option ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ flex: 1 }}>
              <Text style={{ color: "green", fontWeight: "500" }}>
                Tomorrow by 10pm
              </Text>{" "}
              - Free Delivery above ₹500 order
            </Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(2)}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}
      {/* current step - 2 */}
      {currentStep == 2 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Select your Payment method
          </Text>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {paymentMethod === "cash" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setPaymentMethod(cash)}
                name="circle"
                size={20}
                color="gray"
              />
            )}
            <Text>Cash on Delivery</Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {paymentMethod === "card" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setPaymentMethod(card);
                  Alert.alert("UPI/Debit Card", "Pay Online", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("cancel is pressed"),
                    },
                    {
                      text: " OK",
                      onPress: () => pay(),
                    },
                  ]);
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}
            <Text>UPI / Credit or Debit Card</Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(3)}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}
      {/* current step - 3 */}
      {currentStep == 3 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order now</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Save 5% and never run out
              </Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Shipping to Kulveer Singh</Text>
            {/* <Text>Shipping to {selectedAddress?.name}</Text> */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 500, color: "gray" }}>
                Items
              </Text>
              <Text style={{ color: "gray", fontSize: 16 }}>₹{total}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 500, color: "gray" }}>
                Delivery
              </Text>
              <Text style={{ color: "gray", fontSize: 16 }}>₹0</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "gray" }}>
                Order total
              </Text>
              <Text
                style={{
                  color: "gray",
                  fontSize: 18,
                  color: "#C60C30",
                  fontWeight: "bold",
                }}
              >
                ₹{total}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>Pay with</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
              Pay on Delivery (Cash)
            </Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text>Place your Order</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});
