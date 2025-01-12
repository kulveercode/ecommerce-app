import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "expo-router";
import axios from "axios";
import { UserType } from "@/UserContext";

const AddAdressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  console.log("userId", userId);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    // Fetch addresses from API
    try {
      const response = await axios.get(
        `http://192.168.31.231:8000/addresses/${userId}`
      );
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

  // refresh addresses when the new addresses are added
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  console.log("addresses", addresses);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Addresses</Text>
        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            paddingVertical: 7,
            paddingHorizontal: 5,
          }}
        >
          <Text>Add a new Address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>
        <Pressable>
          {/* all the stored addresses  */}
          {addresses?.map((item, index) => (
            <Pressable
              key={index}
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 5,
                marginVertical: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item?.name}
                </Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.houseNo}, {item?.landmark}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.street}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Uttarakhand, {item?.postalCode}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Phone no: {item?.mobileNo}
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
            </Pressable>
          ))}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAdressScreen;

const styles = StyleSheet.create({});
