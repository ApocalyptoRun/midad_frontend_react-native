// // VideoCallScreen.js
// import React, { useEffect, useRef, useState } from 'react';
// import { SafeAreaView, View, Button, StyleSheet, Platform, Dimensions } from 'react-native';
// import { RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices } from 'react-native-webrtc';
// import io from 'socket.io-client';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const socket = io('http://192.168.2.11:3031');

// const VideoCallScreen = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const pc = useRef(new RTCPeerConnection());

//   useEffect(() => {
//     const getPermissions = async () => {
//       const cameraPermission = await check(
//         Platform.select({
//           android: PERMISSIONS.ANDROID.CAMERA,
//           ios: PERMISSIONS.IOS.CAMERA,
//         })
//       );

//       const microphonePermission = await check(
//         Platform.select({
//           android: PERMISSIONS.ANDROID.RECORD_AUDIO,
//           ios: PERMISSIONS.IOS.MICROPHONE,
//         })
//       );

//       if (cameraPermission !== RESULTS.GRANTED) {
//         await request(
//           Platform.select({
//             android: PERMISSIONS.ANDROID.CAMERA,
//             ios: PERMISSIONS.IOS.CAMERA,
//           })
//         );
//       }

//       if (microphonePermission !== RESULTS.GRANTED) {
//         await request(
//           Platform.select({
//             android: PERMISSIONS.ANDROID.RECORD_AUDIO,
//             ios: PERMISSIONS.IOS.MICROPHONE,
//           })
//         );
//       }

//       if (cameraPermission === RESULTS.GRANTED && microphonePermission === RESULTS.GRANTED) {
//         startLocalStream();
//       }
//     };

//     const startLocalStream = async () => {
//       const stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setLocalStream(stream);
//       stream.getTracks().forEach(track => {
//         pc.current.addTrack(track, stream);
//       });
//     };

//     getPermissions();

//     socket.on('offer', async (data) => {
//       await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//       const answer = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answer);
//       socket.emit('answer', answer);
//     });

//     socket.on('answer', async (data) => {
//       await pc.current.setRemoteDescription(new RTCSessionDescription(data));
//     });

//     socket.on('candidate', (data) => {
//       const candidate = new RTCIceCandidate(data);
//       pc.current.addIceCandidate(candidate);
//     });

//     pc.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('candidate', event.candidate);
//       }
//     };

//     pc.current.ontrack = (event) => {
//       setRemoteStream(event.streams[0]);
//     };
//   }, []);

//   const createOffer = async () => {
//     const offer = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offer);
//     socket.emit('offer', offer);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.remoteContainer}>
//         {remoteStream && (
//           <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
//         )}
//       </View>
//       <View style={styles.localContainer}>
//         {localStream && (
//           <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
//         )}
//       </View>
//       <Button title="Start Call" onPress={createOffer} style={styles.startButton} />
//     </SafeAreaView>
//   );
// };

// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   remoteContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   remoteVideo: {
//     width: width,
//     height: height,
//     backgroundColor: 'black',
//   },
//   localContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     width: 100,
//     height: 150,
//     backgroundColor: 'black',
//     borderColor: 'white',
//     borderWidth: 1,
//   },
//   localVideo: {
//     width: '100%',
//     height: '100%',
//   },
//   startButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//   },
// });

// export default VideoCallScreen;
