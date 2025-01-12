import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { IMAGE_URL } from "@/constants/public";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native";
import { CustomTable, TableCol } from "@/components/custom/CustomTable";

export default function Dashboard() {
  return (
    <SafeAreaView className="h-full bg-white p-4">
      <CustomTable width={900}>
        <TableCol
          head='head'
          type='text'
          data={[
            1, 2, 3, 4, 5, 6
          ]}
        />
        <TableCol
          head='head'
          type='text'
          data={[
            1, 2, 3, 4, 5, 6
          ]}
        />
      </CustomTable>
    </SafeAreaView>
  );
}
