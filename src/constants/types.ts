import { LucideIcon } from "lucide-react-native";

export type NavigationItemType = {
  slug: string;
  label: string;
  title: string;
  icon: LucideIcon;
};

export type TabItemType = {
  slug: string;
  label: string;
};

export type DepreciationTableItem = {
  year: number;
  value: number;
}