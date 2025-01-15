import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import EditableDataDisplay from "@/components/custom/EditableDataDisplay";
import { MapPinIcon } from "lucide-react-native";

export default function Fix() {
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView className="my-4 px-4">
        <View className="flex flex-col gap-4">
          <EditableDataDisplay
            icon={MapPinIcon}
            label="Địa chỉ"
            data="Trường Đại Học Công Nghệ Thông Tin - Đhqg Tp.hcm, Số 1, Hàn Thuyên, Khu Phố 6, Phường Linh Trung, Thành Phố Thủ Đức, TP. Hồ Chí Minh"
            onEdit={() => { }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
