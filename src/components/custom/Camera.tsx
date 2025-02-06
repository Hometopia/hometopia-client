import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../ui/icon';
import { ArrowLeftRight, Flashlight, FlashlightOff } from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';

export default function Camera({
  takeAPicture
}: {
  takeAPicture: Function
}) {
  const [facing, setFacing] = useState<CameraType>('back')
  const [flash, setFlash] = useState<FlashMode>('off')
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null)
  const [failMsg, setFailMsg] = useState(false)

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync()
      requestPermission()
    })
  }, [])


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className='flex justify-center h-full w-full'>
        <Text style={styles.message}>Cấp quyền truy cập máy ảnh</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraFlash() {
    setFlash(current => (current === 'off' ? 'on' : 'off'))
  }

  const CaptureFail = <View className='absolute w-full flex flex-row justify-center'>
    <Text className='text-error-400 p-4 rounded-lg bg-white/10 '>Không chụp được, hãy thử lại</Text>
  </View>

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        flash={flash}
        facing={facing}>
        <View></View>

      </CameraView>
      <View className='flex flex-row bg-black py-8 items-end justify-center'>
        {failMsg && CaptureFail}
        <View className='flex flex-row gap-4 items-center relative'>
          <TouchableOpacity
            className={flash === 'on' ? 'p-4 bg-primary-400/20 rounded-lg' : 'p-4 bg-white/10 rounded-lg'}
            onPress={() => toggleCameraFlash()}
          >
            <Icon as={flash === 'on' ? Flashlight : FlashlightOff}
              className={flash === 'on' ? 'text-primary-400 h-8 w-8' : 'text-white h-8 w-8'} />
          </TouchableOpacity>
          <TouchableOpacity
            className=''
            onPress={async () => {
              if (cameraRef.current) {
                try {
                  const capture = await cameraRef.current.takePictureAsync()
                  if (capture)
                    takeAPicture(capture.uri)
                  else {
                    setFailMsg(true)
                    setTimeout(() => {
                      setFailMsg(false)
                    }, 5000)
                  }
                }
                catch (e) {
                  console.log(e)
                }
              }
            }}
          >
            <View className='flex justify-center items-center p-2 border-2 border-white rounded-full'>
              <View className='bg-background-0 h-16 w-16 rounded-full' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className='p-4 bg-white/10 rounded-lg'
            onPress={() => toggleCameraFacing()}
          >
            <Icon as={ArrowLeftRight} className='text-white h-8 w-8' />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 32,
    height: 480,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 32,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});