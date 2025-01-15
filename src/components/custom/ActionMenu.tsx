import React from "react";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import {
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { Input } from "../ui/input";
import { Menu, MenuItem, MenuItemLabel } from "../ui/menu";

export default function ActionMenu() {
  return (
    <Menu
      placement="bottom right"
      offset={5}
      disabledKeys={["Settings"]}
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps} variant="outline" action="secondary">
            <ButtonText>Menu</ButtonText>
            <ButtonIcon as={ChevronDownIcon} />
          </Button>
        );
      }}
    >
      <MenuItem key="Edit" textValue="Edit">
        <EditIcon size={16} className="mr-2" />
        <MenuItemLabel size="sm">Chỉnh sửa</MenuItemLabel>
      </MenuItem>
      <MenuItem key="Delete" textValue="Delete">
        <TrashIcon size={16} className="mr-2" />
        <MenuItemLabel size="sm">Xóa</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}
