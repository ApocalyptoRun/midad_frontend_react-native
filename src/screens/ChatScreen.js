import {
  AppState,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {useNavigation, useRoute} from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import EmojiSelector from "react-native-emoji-selector";
import {COLORS} from "../constants/themes";
import {AuthContext} from "../context/AuthContext";
import {BASE_URL, createConfig} from "../constants/config";
import {io} from "socket.io-client";
import axios from "axios";
import {launchImageLibrary} from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {currentChat} = route.params;
  const currentChatId = currentChat._id;
  const {userToken, userId} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [msg, setMsg] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const config = createConfig(userToken);
  const socket = useRef(null);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [audio, setAudio] = useState();
  const [audioUri, setAudioUri] = useState("");
  const [recording, setRecording] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [filePath, setFilePath] = useState("");

  useEffect(() => {
    fecthMessages();
    setupSocket();
  }, [currentChatId]);

  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#4E73DE",
      },
      headerLeft: () => (
        <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
          <Ionicons
            onPress={() => navigation.goBack()}
            style={{marginLeft: 5}}
            name="arrow-back"
            size={24}
            color="white"
          />

          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                resizeMode: "cover",
              }}
              source={{uri: currentChat?.profilePhoto}}
            />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 15,
                fontWeight: "bold",
                color: "white",
              }}>
              {currentChat?.firstName}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={{marginRight: 16, flexDirection: "row", gap: 12}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("VideoCall", {
                from: userId,
                to: currentChatId,
              })
            }>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="phone" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const handleSend = async (
    messageType,
    content,
    documentName,
    documentType,
  ) => {
    try {
      const formData = new FormData();
      formData.append("recepientId", currentChatId);

      let name;
      if (messageType !== "text") {
        name = documentName;
      }

      formData.append("messageType", messageType);

      if (messageType === "text") {
        formData.append("messageText", msg);
      } else {
        formData.append("file", {
          uri: content,
          name: name,
          type: documentType,
        });
      }

      const response = await fetch(`${BASE_URL}/message/addMessage`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        const responseData = await response.json();
        console.log(responseData);

        socket.current.emit("send-msg", responseData);

        const msgs = [...messages];
        msgs.push(responseData);
        setMessages(msgs);

        setMsg("");
        setSelectedImage("");
      }
    } catch (error) {
      console.log(`Error in sending the message ${error}`);
    }
  };

  const fecthMessages = async () => {
    if (currentChatId) {
      try {
        const response = await axios.post(
          `${BASE_URL}/message/messages`,
          {recepientId: currentChatId},
          config,
        );
        if (response) setMessages(response.data);
      } catch (error) {
        console.log(`Error fecthing message ${error}`);
      }
    }
  };

  const pickImageAndSend = async () => {
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
        const doc = response.assets?.[0];
        handleSend("image", doc.uri, doc.fileName, doc.type);
      }
    });
  };

  const setupSocket = () => {
    if (userId) {
      socket.current = io(BASE_URL);
      socket.current.emit("add-user", userId);

      socket.current.on("msg-receive", data => {
        console.log(appState);
        setArrivalMessage(data);
      });
    }
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const formatTime = time => {
    const options = {hour: "numeric", minute: "numeric"};
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickDocumentAndSend = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      console.log(doc);
      await handleSend("document", doc.uri, doc.name, doc.type);
    } catch (error) {
      console.error("Error picking document:", error);
      return null;
    }
  };

  const downloadFile = async (filePath, fileName) => {
    const actualDownload = async () => {
      const {dirs} = RNFetchBlob.fs;

      const dirToSave = dirs.DownloadDir;

      const configfb = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: fileName,
          path: `${dirToSave}/${fileName}`,
          description: "file download",
        },
      };

      try {
        RNFetchBlob.config(configfb)
          .fetch("GET", filePath)
          .then(res => {
            console.log("file downloaded");
            alert("file downloaded successfully ");
          });
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Error downloading file");
      }
    };

    actualDownload();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView>
        {messages.map((item, index) => {
          const isCurrentUser = item?.senderId?._id === userId;

          const messageStyle = isCurrentUser
            ? {
                alignSelf: "flex-end",
                backgroundColor: COLORS.cornflowerBlue,
              }
            : {
                alignSelf: "flex-start",
                backgroundColor: COLORS.gray4,
              };

          const textStyle = isCurrentUser
            ? {
                fontSize: 13,
                color: "white",
                textAlign: "left",
              }
            : {
                fontSize: 13,
                textAlign: "left",
              };

          const timeStyle = isCurrentUser
            ? {
                textAlign: "right",
                fontSize: 9,
                color: COLORS.gray6,
                marginTop: 5,
              }
            : {
                textAlign: "left",
                fontSize: 9,
                marginTop: 5,
              };

          if (item?.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={[
                  messageStyle,
                  {
                    padding: 8,
                    margin: 10,
                    maxWidth: "60%",
                    borderRadius: 7,
                  },
                ]}>
                <Text style={textStyle}> {item?.message} </Text>
                <Text style={timeStyle}> {formatTime(item.timeStamp)} </Text>
              </Pressable>
            );
          }

          if (item?.messageType === "image") {
            return (
              <Pressable
                key={index}
                onPress={() => handleDownloadFile(item.imageUrl)}
                style={[
                  messageStyle,
                  {
                    padding: 8,
                    margin: 10,
                    maxWidth: "60%",
                    borderRadius: 7,
                  },
                ]}>
                <View>
                  <Image
                    source={{uri: item.imageUrl}}
                    style={{width: 200, height: 200, borderRadius: 7}}
                  />
                  <Text style={timeStyle}> {formatTime(item.timeStamp)} </Text>
                </View>
              </Pressable>
            );
          }

          if (item?.messageType === "document") {
            let fileName = item.imageUrl.split("/").pop();
            fileName = fileName.split("-").pop();
            return (
              <Pressable
                key={index}
                onPress={() => downloadFile(item.imageUrl, fileName)}
                style={[
                  messageStyle,
                  {
                    padding: 8,
                    margin: 10,
                    maxWidth: "60%",
                    borderRadius: 7,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}>
                  <FontAwesome name="file" size={24} color="white" />
                  <Text
                    style={{color: COLORS.white}}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {fileName}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}>
        <Entypo
          onPress={handleEmojiPress}
          style={{marginRight: 5}}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={msg}
          onChangeText={text => setMsg(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
            color: "black",
          }}
          placeholder="Midad message"
          placeholderTextColor="gray"
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}>
          <Entypo
            onPress={pickImageAndSend}
            name="camera"
            size={24}
            color="gray"
          />

          <Ionicons
            onPress={pickDocumentAndSend}
            name="document-attach-outline"
            size={24}
            color="gray"
          />

          <TouchableOpacity
          // onPressIn={handlePressIn}
          // onPressOut={handlePressOut}
          >
            <View /* style={{transform: [{scale: audio ? 2 : 1}]}} */>
              <Feather
                // name={audio ? "stop-circle" : "mic"}
                name="mic"
                size={24}
                color="gray"
              />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleSend("text")}>
          <Ionicons name="send-sharp" size={24} color="#4E73DE" />
        </TouchableOpacity>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={emoji => {
            setMsg(prev => prev + emoji);
          }}
          style={{height: 250}}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
});
