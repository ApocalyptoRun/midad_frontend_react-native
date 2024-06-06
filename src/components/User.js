import {View, Text, TouchableOpacity, Image, Alert} from "react-native";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import axios from "axios";
import {BASE_URL, createConfig} from "../constants/config";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {COLORS} from "../constants/themes";

const User = ({item, navigation, onlineUsers}) => {
  const {userId, userToken, socket} = useContext(AuthContext);
  const [lastMessage, setLastMessage] = useState("");
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    socket.on("lastMessage", data => {
      if (item?._id === data.recepientId || item?._id === data.senderId._id) {
        if (data) {
          setLastMessage(data);
        }
      }
    });
  }, []);

  useEffect(() => {
    setIsUserOnline(onlineUsers.includes(item?._id));
  }, [onlineUsers, item]);

  useEffect(() => {
    fetchLastMessage();
  }, [item.id, userId]);

  const fetchLastMessage = async () => {
    const config = createConfig(userToken);

    const postData = {
      recepientId: item._id,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/message/getLastMessage`,
        postData,
        config,
      );
      setLastMessage(response.data);
    } catch (error) {
      console.error("Error fetching last message:", error);
    }
  };

  const formatTime = time => {
    const options = {hour: "numeric", minute: "numeric", hour12: false};
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", {currentChat: item})}
      style={{flexDirection: "row", alignItems: "center", marginVertical: 10}}>
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{
            uri: item.profilePhoto
              ? item.profilePhoto
              : "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
          }}
        />
        {isUserOnline && (
          <View
            style={{
              position: "absolute",
              bottom: -1,
              right: -1,
              backgroundColor: "green",
              width: 15,
              height: 15,
              borderRadius: 8,
              zIndex: 1,
            }}
          />
        )}
      </View>

      <View style={{marginLeft: 12, flex: 1}}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={{fontWeight: "bold", color: "black"}}>
            {item?.firstName}
          </Text>

          {lastMessage && (
            <View style={{flexDirection: "row"}}>
              <MaterialIcons
                name="done"
                size={18}
                color={COLORS.cornflowerBlue}
              />
              <Text style={{color: "gray", marginLeft: 5}}>
                {formatTime(lastMessage?.timeStamp)}
              </Text>
            </View>
          )}
        </View>

        {lastMessage && lastMessage.messageType === "text" && (
          <Text numberOfLines={1} style={{marginTop: 4, color: "grey"}}>
            {lastMessage.message}
          </Text>
        )}

        {lastMessage && lastMessage.messageType === "image" && (
          <View style={{flexDirection: "row", marginTop: 2}}>
            <Image
              style={{width: 25, height: 25, borderRadius: 8}}
              source={{uri: lastMessage.imageUrl}}
            />
            <Text style={{color: "gray"}}>
              {lastMessage.imageUrl.split("/").pop()}
            </Text>
          </View>
        )}

        {lastMessage && lastMessage.messageType === "document" && (
          <View style={{flexDirection: "row", marginTop: 2}}>
            <MaterialIcons name="attach-file" size={22} color="gray" />
            <Text style={{color: "gray"}}>
              {lastMessage.imageUrl.split("/").pop()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default User;
