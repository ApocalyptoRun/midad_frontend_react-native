import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {COLORS} from "../constants/themes";
import images from "../constants/images";
import Ionicons from "react-native-vector-icons/Ionicons";
import {AuthContext} from "../context/AuthContext";
import {BASE_URL, createConfig} from "../constants/config";
import axios from "axios";

const CustomDrawer = props => {
  const {logout, userToken} = useContext(AuthContext);
  const [user, setUser] = useState();

  useEffect(() => {
    const config = createConfig(userToken);

    const fetchUserById = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/getUserById`,
          config,
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    };

    fetchUserById();
  }, []);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: COLORS.cornflowerBlue}}>
        <View style={{backgroundColor: COLORS.cornflowerBlue}}>
          <Image
            source={{
              uri: user?.profilePhoto
                ? user.profilePhoto
                : "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
            }}
            style={styles.imgProfile}
          />
          <Text style={styles.nameProfile}>{user?.firstName}</Text>
          <Text style={styles.phoneNumberProfile}>+{user?.phoneNumber}</Text>
        </View>
        <View style={{flex: 1, backgroundColor: "white", paddingTop: 12}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: "#ccc"}}>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Ionicons name="share-social-outline" size={22} color="black" />
            <Text
              style={{
                color: "black",
                fontFamily: "Roboto-Medium",
                marginLeft: 5,
              }}>
              Tell a friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logout}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Ionicons name="exit-outline" size={22} color="black" />
            <Text
              style={{
                color: "black",
                fontFamily: "Roboto-Medium",
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  imgProfile: {
    width: 60,
    height: 60,
    borderRadius: 40,
    margin: 15,
  },
  nameProfile: {
    marginLeft: 15,
    marginBottom: 4,
    fontWeight: "bold",
  },
  phoneNumberProfile: {
    marginLeft: 15,
    marginBottom: 4,
  },
});
