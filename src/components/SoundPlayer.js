// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import { Audio } from "expo-av";
// import Slider from "@react-native-community/slider";
// import { IconButton } from "react-native-paper";
// import { COLORS } from "../constants/themes";
// import { set } from "react-hook-form";

// const SoundPlayer = ({ item }) => {
//   const [sound, setSound] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [durationMillis, setDurationMillis] = useState(null);
//   const [currentPlaybackMillis, setCurrentPlaybackMillis] = useState(0);

//   let playbackStatusUpdateListener;

//   useEffect(() => {
//     const loadSound = async () => {
//       try {
//         const { sound } = await Audio.Sound.createAsync({ uri: item.imageUrl });

//         const status = await sound.getStatusAsync();

//         if (status.isLoaded) {
//           setDurationMillis(sound.durationMillis);
//           console.log(sound.durationMillis)
//           setSound(sound);
//         }

//         playbackStatusUpdateListener = sound.setOnPlaybackStatusUpdate(
//           handlePlaybackStatusUpdate
//         );
//       } catch (error) {
//         console.log("Error loading sound: ", error);
//       }
//     };

//     loadSound();

//     /*  return () => {
//         sound?.unloadAsync();
//       }; */
//   }, [item.imageUrl]);

//   const handlePlayPause = async () => {
//     try {
//       if (!sound) {
//         console.log("Sound is not initialized");
//         return;
//       }
      
//       if (isPlaying) {
//         await sound.pauseAsync();
//       } else {
//         const status = await sound.getStatusAsync();
//         if (status.isLoaded) {
//           await sound.playAsync();
//         } else {
//           console.log("Audio not yet loaded, retrying...");
//           await sound.unloadAsync();
//           const { sound } = await Audio.Sound.createAsync({
//             uri: item.imageUrl,
//           });
//           setDurationMillis(sound.durationMillis);
//           setSound(sound);
//           await sound.playAsync();

//           playbackStatusUpdateListener = sound.setOnPlaybackStatusUpdate(
//             () => {}
//           );
//         }
//       }

//       setIsPlaying(!isPlaying);
//     } catch (error) {
//       console.log("Error handling play/pause", error);
//     }
//   };

//   const handlePlaybackStatusUpdate = async (newStatus) => {
//     if (newStatus.didJustFinish) {
//       setIsPlaying(false);
//       setCurrentPlaybackMillis(0);

//       try {
//         await sound.stopAsync();
//         await sound.unloadAsync();
//       } catch (error) {
//         console.log("Error in stop and unload", error);
//       }

//       const { sound } = await Audio.Sound.createAsync({ uri: item.imageUrl });
//       setDurationMillis(sound.durationMillis);
//       console.log(typeof sound.durationMillis);

//       setSound(sound);

//       playbackStatusUpdateListener = sound.setOnPlaybackStatusUpdate(
//         handlePlaybackStatusUpdate
//       );
//     } else {
//       setCurrentPlaybackMillis(newStatus.positionMillis);
//     }
//   };

//   const handleSliderChange = async (value) => {
//     setCurrentPlaybackMillis(value);
//     if (isPlaying && typeof sound.seekAsync === "function") {
//       //await sound.seekAsync(value);
//       await sound.setPositionAsync(value);
//     }
//   };

//   const stopSound = async () => {
//     if (sound) {
//       try {
//         await sound.unloadAsync();
//         setSound(null);
//       } catch (error) {
//         console.error("Error stopping sound: ", error);
//       }
//     }
//   };

//   return (
//     <View>
//       <View style={styles.container}>
//         <TouchableOpacity onPress={handlePlayPause}>
//           <IconButton
//             icon={isPlaying ? "pause" : "play"}
//             size={48}
//             iconColor={COLORS.cornflowerBlue}
//           />
//         </TouchableOpacity>
//         <Slider
//           style={styles.slider}
//           minimumValue={0}
//           maximumValue={durationMillis || 1}
//           value={currentPlaybackMillis}
//           onValueChange={handleSliderChange}
//           thumbTintColor={COLORS.cornflowerBlue}
//           minimumTrackTintColor={COLORS.cornflowerBlue}
//         />
//         <Text style={styles.durationText}>
//           {formatTime(currentPlaybackMillis)} / {formatTime(durationMillis)}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const formatTime = (millis) => {
//   if (millis !== null) {
//     const minutes = Math.floor(millis / (1000 * 60));
//     const seconds = Math.floor((millis % (1000 * 60)) / 1000);
//     return (
//       minutes.toString().padStart(2, "0") +
//       ":" +
//       seconds.toString().padStart(2, "0")
//     );
//   } else {
//     return "00:00"; // Or any placeholder value you prefer
//   }
// };

// export default SoundPlayer;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//   },
//   playButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderRadius: 5,
//     backgroundColor: "skyblue",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//   },
//   slider: {
//     flex: 1,
//   },
//   durationText: {
//     fontSize: 12,
//   },
// });
