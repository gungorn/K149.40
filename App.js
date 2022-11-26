import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View, useWindowDimensions, Image } from 'react-native';

import { Camera, useCameraDevices } from 'react-native-vision-camera';

const App = props => {
  const dual = useCameraDevices('dual-camera');
  const dualWide = useCameraDevices('dual-wide-camera');
  const telephoto = useCameraDevices('telephoto-camera');
  const triple = useCameraDevices('triple-camera');
  const ultraWideAngle = useCameraDevices('ultra-wide-angle-camera');
  const wideAngle = useCameraDevices('wide-angle-camera');

  const cameraRef = useRef();

  const { width, height } = useWindowDimensions();

  const [front, setFront] = useState({});
  const [back, setBack] = useState({});

  const [frontDevices, setFrontDevices] = useState([]);
  const [backDevices, setBackDevices] = useState([]);

  const [frontOrBack, setFrontOrBack] = useState('back');
  const [selectedDeviceName, setSelectedDeviceName] = useState();

  const [CameraIsOk, setCameraIsOK] = useState(false);

  const [takePhotoButtonPressed, setTakePhotoButtonPressed] = useState(false);
  const [lastPhotoPath, setLastPhotoPath] = useState('');

  useEffect(() => {
    permissionCheck();
    getAvailableCameraDevices();
    return () => {};
  }, []);

  const permissionCheck = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
  };

  const getAvailableCameraDevices = async () => {
    const devices = await Camera.getAvailableCameraDevices();

    if (/* Array.isArray(devices) && */ devices.length > 0) {
      const backDevicesIndex = devices.findIndex(d => d.position === 'back');
      const frontDevicesIndex = devices.findIndex(d => d.position === 'front');

      setFrontDevices(devices[frontDevicesIndex].devices);
      setFront({ ...devices[frontDevicesIndex] });

      setBackDevices(devices[backDevicesIndex].devices);
      setBack({ ...devices[backDevicesIndex] });

      if (devices[backDevicesIndex].devices.length > 0) {
        setSelectedDeviceName(devices[backDevicesIndex].devices[0]);
      }

      setCameraIsOK(true);
    }
  };

  const getSelectedDevice = () => {
    switch (selectedDeviceName) {
      case 'dual-camera':
        return dual;
      case 'dual-wide-camera':
        return dualWide;
      case 'telephoto-camera':
        return telephoto;
      case 'triple-camera':
        return triple;
      case 'ultra-wide-angle-camera':
        return ultraWideAngle;
      case 'wide-angle-camera':
        return wideAngle;
    }
  };

  const takePhoto = async () => {
    const photo = await cameraRef.current.takePhoto({
      flash: 'on',
    });
    setLastPhotoPath(photo.path);
  };

  const selectedDevice = getSelectedDevice();

  return (
    <View style={styles.container}>
      {CameraIsOk && selectedDevice && <Camera ref={cameraRef} style={styles.camera} device={selectedDevice[frontOrBack]} isActive photo />}

      <View style={styles.subContainer}>
        {lastPhotoPath ? (
          <View style={styles.lastPhotoContainer}>
            <Image source={{ uri: 'file://' + lastPhotoPath }} style={[styles.lastPhoto, { width: width * 0.14, height: width * 0.14 }]} />
          </View>
        ) : null}

        <TouchableOpacity
          onPressIn={() => setTakePhotoButtonPressed(true)}
          onPressOut={() => setTakePhotoButtonPressed(false)}
          onPress={() => takePhoto()}
          style={takePhotoButtonPressed ? styles.takePhotoButtonPressed : styles.takePhotoButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    ...StyleSheet.absoluteFill,
  },
  subContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },

  takePhotoButton: {
    borderWidth: 3,
    borderRadius: 999,
    width: '14%',
    aspectRatio: 1,
    borderColor: '#fff',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#00000033',
  },
  takePhotoButtonPressed: {
    borderWidth: 0,
    borderRadius: 999,
    width: '14%',
    aspectRatio: 1,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#fff',
  },

  lastPhotoContainer: {
    position: 'absolute',
    bottom: 16,
    left: 32,
  },
  lastPhoto: {
    borderRadius: 999,
  },
});

export default App;
