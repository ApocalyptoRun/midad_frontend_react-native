import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {Avatar, TextInput} from "react-native-paper";
import {COLORS, SIZES} from "../constants/themes";
import {launchImageLibrary} from "react-native-image-picker";
import Button from "../components/Button.js";
import {BASE_URL} from "../constants/config.js";
import {AuthContext} from "../context/AuthContext.js";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const UserDetails = ({navigation}) => {
  const [firstName, setFirstName] = useState("");
  const [image, setImage] = useState("");
  const {userToken} = useContext(AuthContext);

  const saveDetails = async () => {
    if (!firstName) {
      Alert.alert("Firstname is required !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("file", {
        uri: image,
        name: "image.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(`${BASE_URL}/user/updateProfile`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const contentType = response.headers.get("Content-Type");

      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log(responseData);
      } else {
        responseData = await response.text();
        console.log(responseData);
      }

      if (response.ok) {
        // setIsFirstAuth(!isFirstAuth);
        navigation.navigate("Home");
      } else {
        console.log(`Error: ${responseData}`);
      }
    } catch (error) {
      console.log(`Error while updating user details ${error}`);
    }
  };

  const pickImage = async () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("Image picker error: ", response.error);
      } else {
        let imageUri = response.assets?.[0]?.uri;
        setImage(imageUri);
      }
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text style={{fontSize: 20, color: COLORS.black}}>
            Set up your profile
          </Text>
          <Text style={{color: COLORS.black, paddingRight: 16}}>
            Profiles are visible to peaple you message, contact, and groups.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: 24,
            marginBottom: 24,
          }}>
          <View>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.photoProfile}>
                <View style={styles.female}>
                  {image ? (
                    <Avatar.Image
                      size={100}
                      source={{uri: image}}
                      style={styles.avatar}
                    />
                  ) : (
                    <SimpleLineIcons
                      name="user-female"
                      size={50}
                      color="black"
                    />
                  )}
                </View>
                <View style={styles.cameraContainer}>
                  <View style={styles.camera}>
                    <SimpleLineIcons name="camera" size={20} color="black" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{color: "black", marginTop: 8}}>{firstName}</Text>
        </View>

        <TextInput
          label="Firstname (required)"
          mode="outlined"
          onChangeText={text => setFirstName(text)}
          value={firstName}
        />

        <Button title="Next" onPress={saveDetails} style={{marginTop: 24}} />
      </View>
    </SafeAreaView>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    padding: 34,
  },
  photoProfile: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  female: {
    backgroundColor: "#FFFACD",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: "flex-end",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
    zIndex: 1,
  },
  cameraContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
