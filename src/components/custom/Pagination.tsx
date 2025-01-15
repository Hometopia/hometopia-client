import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { Text } from "../ui/text";
import { useState } from "react";
import { View } from "react-native";
import { Pressable } from "../ui/pressable";
import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import React from "react";

const PageChangeButton = ({
  leftDirection = true,
  onChange,
  isDisabled = false,
}: {
  leftDirection: boolean;
  onChange?: any;
  isDisabled?: boolean;
}) => {
  const containerStyle =
    "w-fit h-[36px] flex flex-row items-center px-3 rounded-lg";
  const items = (
    <>
      {leftDirection ? <ArrowLeft size={16} color="#333" /> : <></>}
      <Text className="select-none text-base font-normal text-primary-300">
        {leftDirection ? "Trước" : "Sau"}
      </Text>
      {!leftDirection ? (
        <ArrowRight size={16} className="text-inherit" />
      ) : (
        <></>
      )}
    </>
  );

  if (!isDisabled) {
    return (
      <Pressable
        className={`${containerStyle} bg-background-0 border border-typography-200 text-typography-900 active:bg-background-50`}
        onPress={onChange}
      >
        {leftDirection ? <ArrowLeft size={16} color="rgb(23 23 23)" /> : <></>}
        {!leftDirection ? (
          <ArrowRight size={16} color="rgb(23 23 23)" />
        ) : (
          <></>
        )}
      </Pressable>
    );
  } else {
    return (
      <View
        className={`${containerStyle} bg-background-0 border border-typography-200 text-typography-400`}
      >
        {leftDirection ? <ArrowLeft size={16} color="rgb(163 163 163)" /> : <></>}
        {!leftDirection ? (
          <ArrowRight size={16} color="rgb(163 163 163)" />
        ) : (
          <></>
        )}
      </View>
    );
  }
};

const PageNumber = ({
  number,
  active = false,
  onChange,
}: {
  number: number;
  active?: boolean;
  onChange?: any;
}) => {
  const generalStyle =
    "w-[40px] h-[36px] flex items-center justify-center gap-1 rounded-lg ";
  const styles = {
    default: `${generalStyle} border border-background-200 bg-background-0 active:bg-background-100 text-typography-900 font-normal`,
    active: `${generalStyle} bg-primary-50 active:bg-primary-100 text-primary-400 font-bold`,
  };
  const textStyle = {
    default: `text-base leading-4 text-inherit text-typography-900 font-normal`,
    active: `text-base leading-4 text-inherit text-primary-400 font-bold`,
  }
  return (
    <Pressable
      className={active ? `${styles.active}` : `${styles.default}`}
      onPress={() => onChange(number)}
    >
      <Text className={active ? `${textStyle.active}` : `${textStyle.default}`}>{number}</Text>
    </Pressable>
  );
};

const Pages = ({
  quantity,
  active,
  length = 3,
  onChange,
}: {
  quantity: number;
  active: number;
  length?: number;
  onChange?: any;
}) => {
  const Spread = () => (
    <View className="flex h-[36px] w-[40px] items-center gap-1 bg-background-0 px-4 py-2 text-typography-900">
      <Text className="text-md font-medium leading-4 tracking-wider text-inherit">
        ...
      </Text>
    </View>
  );

  if (quantity <= length + 2) {
    return (
      <>
        {Array.from({ length: quantity }, (_, index) => (
          <PageNumber
            key={index + 1}
            number={index + 1}
            active={active === index + 1 ? true : false}
            onChange={onChange}
          />
        ))}
      </>
    );
  } else if (active <= length || active >= quantity - length + 1) {
    return (
      <>
        <PageNumber
          key={1}
          number={1}
          active={active === 1 ? true : false}
          onChange={onChange}
        />
        {active > length ? <Spread /> : <></>}
        {Array.from({ length: length - 1 }, (_, index) => {
          if (active <= length) {
            return (
              <PageNumber
                key={1 + 1 + index}
                number={1 + 1 + index}
                active={active === index + 1 + 1 ? true : false}
                onChange={onChange}
              />
            );
          } else if (active >= quantity - length + 1) {
            return (
              <PageNumber
                key={quantity - length + 1 + index}
                number={quantity - length + 1 + index}
                active={active === quantity - length + 1 + index ? true : false}
                onChange={onChange}
              />
            );
          }
        })}
        {active < quantity - length + 1 ? <Spread /> : <></>}
        <PageNumber
          key={quantity}
          number={quantity}
          active={active === quantity ? true : false}
          onChange={onChange}
        />
      </>
    );
  } else {
    return (
      <>
        <PageNumber
          key={1}
          number={1}
          active={active === 1 ? true : false}
          onChange={onChange}
        />
        <Spread />
        <PageNumber
          number={active}
          active={true}
          onChange={onChange}
        />

        <Spread />
        <PageNumber
          key={quantity}
          number={quantity}
          active={active === quantity ? true : false}
          onChange={onChange}
        />
      </>
    );
  }
};
export default function Pagination({
  quantity,
  active,
  onChange,
}: {
  quantity: number;
  active: number;
  onChange: any;
}) {
  return (
    <View className="flex flex-row gap-2">
      <PageChangeButton
        leftDirection={true}
        isDisabled={active === 1 ? true : false}
        onChange={() => onChange(active - 1)}
      />
      <Pages quantity={quantity} active={active} onChange={onChange} />
      <PageChangeButton
        leftDirection={false}
        isDisabled={active === quantity ? true : false}
        onChange={() => onChange(active + 1)}
      />
    </View>
  );
}
