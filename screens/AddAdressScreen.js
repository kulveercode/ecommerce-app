import React, { useContext, useEffect, useState } from "react";
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
import { useNavigation } from "expo-router";
import axios from "axios";
import { UserType } from "@/UserContext";
import { jwtDecode } from "jwt-decode";

const AddAdressScreen = () => {
  const navigation = useNavigation();
  const [adresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  console.log("userId", userId);

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
          <Pressable
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

            <View style={{flexDirection:"row", alignItems:"center", gap:10, marginTop:7}}>
              <Pressable
                style={{
                  borderColor: "#D0D0D0",
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  paddingVertical:6,
                  borderWidth:0.9,
                }}
              >
                <Text>Edit</Text>
              </Pressable>
              <Pressable
                style={{
                  borderColor: "#D0D0D0",
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  paddingVertical:6,
                  borderWidth:0.9,
                }}
              >
                <Text>remove</Text>
              </Pressable>
              <Pressable
                style={{
                  borderColor: "#D0D0D0",
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  paddingVertical:6,
                  borderWidth:0.9,
                }}
              >
                <Text>Set as Default</Text>
              </Pressable>
             
            </View>
          </Pressable>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAdressScreen;

const styles = StyleSheet.create({});
