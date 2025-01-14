import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import VendorDetailsModal from './VendorDetailsModal'
import { Icon } from '../ui/icon'
import { CheckIcon } from 'lucide-react-native'
import { VendorType } from '@/api/types/common'

type VendorCardPropsType = {
  data: VendorType
  choosenFn: () => void,
  isChosen: boolean,
  cancelFn: () => void,
}

export default function VendorCard({ data, choosenFn, isChosen, cancelFn }: VendorCardPropsType) {
  const Modal = VendorDetailsModal(data, choosenFn, cancelFn)
  const Address = () => (
    <View>
      <Text
        numberOfLines={2}
        className={!isChosen ? 'text-md' :
          'text-md text-white'
        }
      >{data.address}</Text>
    </View>
  )
  const Phone = () => (
    <View>
      <Text
        className={!isChosen ? 'text-md' :
          'text-md text-white'
        }
      >{data.phoneNumber}</Text>
    </View>
  )
  const Website = () => (
    <View>
      <Text
        numberOfLines={2}
        className={!isChosen ? 'text-md' :
          'text-md text-white'
        }
      >{data.website}</Text>
    </View>
  )


  return (
    <TouchableOpacity
      style={{ width: 240, paddingHorizontal: 16, paddingBottom: 4, paddingTop: 16 }}
      className={!isChosen ?
        'flex rounded-xl border border-typography-200 '
        :
        'flex bg-primary-400 rounded-xl border border-typography-200 '
      }
      onPress={() => Modal.setShowModal(true)}
    >
      <Text
        numberOfLines={2}
        className={!isChosen ? 'text-xl font-bold text-typography-800' :
          'text-xl font-bold text-white'
        }
      >
        {data.name}
      </Text>
      <View className='flex flex-col gap-2 mt-4'>
        <Address />
        <Phone />
        <Website />
      </View>
      <Modal.modal />
      <View className='flex flex-row justify-end'>
        <Icon as={CheckIcon} className='text-white w-8 h-8' />
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

})