import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const User = ({ item, navigation }) => {
  console.log(item)
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChatScreen", { currentChat: item })
      }
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item.profilePhoto }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold", color: "black" }}>{item?.firstName}</Text>
        <Text style={{ marginTop: 4, color: "grey" }}>{item?.email}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default User;
