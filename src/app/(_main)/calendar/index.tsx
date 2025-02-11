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

export default function Calendar() {
  const { selected } = useLocalSearchParams()
  const globalValues = useGlobalContext()

  const queryClient = useQueryClient()

  const [scheduleListQuery, setScheduleListQuery] = useState<ResponseBaseType | undefined>(queryClient.getQueryData(['schedule-list']))

  return (
    <BaseScreenContainer>
      {scheduleListQuery === undefined ?
        <Loading texts={[{
          condition: true,
          text: 'Đang tải...'
        }]}
        />
        :
        <Schedule
          theme={globalValues.themeMode === 'dark' ? 'dark' : 'light'}
          data={scheduleListQuery.data.items.filter((i: ScheduleResponseType) => i.vendor !== null)}
          selected={selected ? selected as string : dateToYYYYMMDD(new Date())}
          touchFn={(id: string) => router.push({
            pathname: `/(_main)/calendar/${id}`,
            params: {
              data: JSON.stringify(scheduleListQuery.data.items.find((i: ScheduleResponseType) => i.id == id))
            }
          })}
        />
      }

    </BaseScreenContainer>
  );
}
