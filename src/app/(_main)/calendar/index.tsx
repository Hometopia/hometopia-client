import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Schedule from "@/components/custom/Schedule"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScheduleService } from "@/api/ScheduleService";
import Loading from "@/components/feedback/Loading";
import { dateToYYYYMMDD } from "@/helpers/time";
import { Href, router, useLocalSearchParams } from "expo-router";
import { ResponseBaseType, ScheduleResponseType } from "@/api/types/response";
import { ScheduleType } from "@/constants/data_enum";
import useFormControl from "@/hooks/useFormControl";
import ControllableInput from "@/components/custom/ControllableInput";
import { Input, InputField } from "@/components/ui/input";
import BaseScreenContainer from "@/components/container/BaseScreenContainer";
import { useGlobalContext } from "@/contexts/GlobalProvider";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  const { selected } = useLocalSearchParams()
  const globalValues = useGlobalContext()
  const scheduleListQuery = useQuery({
    queryKey: ['schedule-list'],
    queryFn: () => ScheduleService.getListSchedule()
  })

  return (
    <BaseScreenContainer>
      {scheduleListQuery.isPending ?
        <Loading texts={[{
          condition: true,
          text: 'Đang tải...'
        }]}
        />
        :
        <Schedule
          theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'}
          data={scheduleListQuery.data.data.items.filter((i: ScheduleResponseType) => i.vendor !== null)}
          selected={selected ? selected as string : dateToYYYYMMDD(new Date())}
          touchFn={(id: string) => router.push(`/(_main)/calendar/${id}`)}
        />
      }

    </BaseScreenContainer>
  );
}
