import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '../ui/modal'
import { Text } from '../ui/text'
import { Icon } from '../ui/icon'
import { Button, ButtonText } from '../ui/button'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { extractLatLng } from '@/helpers/map'
import { Href, Link } from 'expo-router'
import { XIcon } from 'lucide-react-native'
import { VendorType } from '@/api/types/common'

export default function VendorDetailsModal(
  data: VendorType,
  confirmFn: () => void,
  cancelFn: () => void
) {
  const [showModal, setShowModal] = useState(false)
  const [coordinator, setCoordinator] = useState(extractLatLng(data.link))
  const Location = () => (
    <View className='h-60 rounded-lg my-2'>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: coordinator.latitude,
          longitude: coordinator.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker
          coordinate={{ latitude: coordinator.latitude, longitude: coordinator.longitude }}
          description="Vị trí này được lấy từ Google Maps"
        />
      </MapView>
    </View>
  )

  const modal = () => (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text size="xl" className="text-typography-800 font-bold">
            {data.name}
          </Text>
          <ModalCloseButton>
            <Icon
              as={XIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <View className='self-stretch'>
            <Location />
            <View className='flex flex-col py-2 gap-4'>
              <View className='flex flex-col'>
                <Text className='text-lg font-bold'>Tên:</Text>
                <Text className='text-lg'>{data.name}</Text>
              </View>
              <View className='flex flex-col'>
                <Text className='text-lg font-bold'>Website:</Text>
                <Link className='text-lg text-info-500 focus:text-info-500/50'
                  href={data.website as Href}>
                  {data.website}
                </Link>
              </View>
              <View className='flex flex-col'>
                <Text className='text-lg font-bold'>Điện thoại:</Text>
                <Text className='text-lg'>{data.phoneNumber}</Text>
              </View>
            </View>

          </View>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              setShowModal(false)
              cancelFn()
            }}
          >
            <ButtonText>Hủy bỏ</ButtonText>
          </Button>
          <Button
            onPress={() => {
              setShowModal(false)
              confirmFn()
            }}
          >
            <ButtonText>Xác nhận</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
  return {
    setShowModal,
    modal,
  }
}