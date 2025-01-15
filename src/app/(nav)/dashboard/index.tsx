import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { IMAGE_URL } from "@/constants/public";
import { Text } from "@/components/ui/text";
import { SafeAreaView, View } from "react-native";
import { CustomTable, TableCol } from "@/components/custom/CustomTable";

export default function Dashboard() {
  return (
    <SafeAreaView className="h-full bg-white p-4">
      <View className="flex flex-col justify-center items-center">
        <Text>Coming soon</Text>
      </View>

    </SafeAreaView>
  );
}
