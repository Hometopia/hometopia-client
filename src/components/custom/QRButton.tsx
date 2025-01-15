import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { QrCode } from "lucide-react-native";
import { Menu, MenuItem, MenuItemLabel } from "../ui/menu";
import { useState } from "react";
import QRCode from "react-native-qrcode-svg";
export default function QRButton() {
  const [generate, setGenerate] = useState(false);
  return (
    <Menu
      placement="bottom right"
      offset={5}
      disabledKeys={["Settings"]}
      trigger={({ ...triggerProps }) => {
        return (
          <Button
            {...triggerProps}
            className="h-10 w-10 p-[6px]"
            variant="outline"
            action="secondary"
          >
            <QrCode strokeWidth={2} size={24} />
          </Button>
        );
      }}
    >
      {generate ? (
        <MenuItem
          key="Add account"
          textValue="Add account"
          className="flex justify-center"
        >
          <Button
            variant="solid"
            action="primary"
            onPress={() => setGenerate((prev) => (prev = true))}
          >
            <ButtonText>Tạo QR</ButtonText>
          </Button>
        </MenuItem>
      ) : (
        <MenuItem
          key="Add account"
          textValue="Add account"
          className="flex justify-center"
        >
          <QRCode value="http://localhost:8081/257decu_u23_w343" />
        </MenuItem>
      )}
    </Menu>
  );
}
