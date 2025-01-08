import { View, Text } from 'react-native'
import React from 'react'
import { Modal, ModalBackdrop } from '../ui/modal'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { Image } from '../ui/image'

export default function HouseClassifiModal() {
  const [showModal, setShowModal] = React.useState(false)
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
    >
      <ModalBackdrop />
      <View className="bg-transparent h-[14rem] rounded-lg">
        <ReactNativeZoomableView
          maxZoom={2}
          minZoom={0.8}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
        >
          <Image
            className="w-[30rem] h-[14rem]"
            source={require("@/assets/images/housing-classification.png")}
            alt="onboarding-img"
          />
        </ReactNativeZoomableView>
      </View>
    </Modal>
  )
}