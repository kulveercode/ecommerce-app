import React from "react";
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
const AddAdressScreen = () => {
  const navigation = useNavigation();

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
        <Pressable>{/* all the stored addresses  */}</Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAdressScreen;

const styles = StyleSheet.create({});
