import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Icon } from '../ui/icon'
import { LocateIcon } from 'lucide-react-native'
import { Modal, ModalBackdrop, ModalContent } from '../ui/modal'
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { StyleSheet } from 'react-native'
import { Button, ButtonText } from '../ui/button'
export default function OnMapLocationPicker({
  selectedLocation, pickFn
}: {
  selectedLocation: LatLng,
  pickFn: Function
}) {
  const [showModal, setShowModal] = useState(false)
  const [region, setRegion] = useState<Region>({
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  })
  const [pickedLocation, setPickedLocation] = useState<LatLng>(selectedLocation)
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setPickedLocation({ latitude, longitude } as LatLng)
  };

  const confirmLocation = () => {
    pickFn(pickedLocation)
    setRegion({
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    })
    setShowModal(false)
  }
  return (
    <View>
      <TouchableOpacity className='py-2 px-4 rounded-full bg-primary-400/10 flex flex-row gap-2'
        onPress={() => setShowModal(true)}
      >
        <Icon as={LocateIcon} className='text-primary-400' />
        <Text className='text-primary-400 font-semibold'>Chọn vị trí</Text>
      </TouchableOpacity>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        size='full'
      >
        <ModalBackdrop />
        <ModalContent className='h-4/5'>
          <View className='h-5/6 rounded-lg my-2'>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={StyleSheet.absoluteFillObject}
              initialRegion={region}
              // onRegionChangeComplete={handleRegionChangeComplete}
              // scrollEnabled={false}
              // zoomEnabled={false}
              // rotateEnabled={false}
              // pitchEnabled={false}
              onPress={handleMapPress}
            >
              {pickedLocation && (
                <Marker coordinate={pickedLocation} title="Vị trí đang được chọn" />
              )}
            </MapView>

          </View>
          <Button className='rounded-lg mt-4' onPress={confirmLocation} size='lg'>
            <ButtonText>Chọn vị trí</ButtonText>
          </Button>
        </ModalContent>
      </Modal>
    </View>
  )
}