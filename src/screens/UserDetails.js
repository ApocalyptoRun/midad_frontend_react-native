import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useContext, useState} from "react";
import {Avatar, TextInput} from "react-native-paper";
import {COLORS, SIZES} from "../constants/themes";
import images from "../constants/images";
import {launchImageLibrary} from "react-native-image-picker";
import Button from "../components/Button.js";
import {BASE_URL} from "../constants/config.js";
import {AuthContext} from "../context/AuthContext.js";

const UserDetails = ({navigation}) => {
  const [firstName, setFirstName] = useState("");
  const [image, setImage] = useState("");
  const {userToken, isFirstAuth, setIsFirstAuth} = useContext(AuthContext);

  const saveDetails = async () => {
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
        setIsFirstAuth(!isFirstAuth);
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <TouchableOpacity onPress={pickImage}>
            <Avatar.Image
              size={96}
              source={image ? {uri: image} : images.cameraPlus}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          label="Firstname"
          mode="outlined"
          onChangeText={text => setFirstName(text)}
          value={firstName}
        />

        <Button title="Save" onPress={saveDetails} style={{marginTop: 24}} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
});

export default UserDetails;
