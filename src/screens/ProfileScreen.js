import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";

const ProfileScreen = ({route, navigation}) => {
  const TostMessage = () => {
    ToastAndroid.show("Edited Sucessfully !", ToastAndroid.SHORT);
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionic name="close-outline" style={{fontSize: 35, color: "black"}} />
        </TouchableOpacity>
        <Text style={{fontSize: 16, fontWeight: "bold", color: "gray"}}>
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={() => {
            TostMessage();
            navigation.goBack();
          }}>
          <Ionic name="checkmark" style={{fontSize: 35, color: "#3493D9"}} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",

        }}>
        <View>
          <Image
            source={{
              uri: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
            }}
            style={{width: 200, height: 200, borderRadius: 100}}
          />
        </View>
        <View style={{alignSelf:"flex-end", right:50}}>
          <Ionic name="camera" size={35} color="gray" />
        </View>
      </TouchableOpacity>

      <View style={{padding: 10}}>
        <View>
          <Text
            style={{
              opacity: 0.5,
              color: "red",
            }}>
            Name
          </Text>
          <TextInput
            placeholder="name"
            defaultValue="ibrahima"
            style={{
              fontSize: 16,
              borderBottomWidth: 1,
              borderColor: "#CDCDCD",
              color: "red",
            }}
          />
        </View>
        <View style={{paddingVertical: 10}}>
          <Text
            style={{
              opacity: 0.5,
              color: "red",
            }}>
            Phone Number
          </Text>
          <TextInput
            placeholder="accountname"
            defaultValue="accountName"
            style={{
              fontSize: 16,
              borderBottomWidth: 1,
              borderColor: "#CDCDCD",
              color: "red",
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
});
