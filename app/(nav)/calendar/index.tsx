import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import Schedule from "@/components/custom/Schedule"
import { useQuery } from "@tanstack/react-query";
import { ScheduleService } from "@/api/ScheduleService";
import Loading from "@/components/feedback/Loading";
import { dateToYYYYMMDD } from "@/helpers/time";
import { Href, router } from "expo-router";
import { ScheduleResponseType } from "@/api/types/response";

export default function Calendar() {
  const scheduleListQuery = useQuery({
    queryKey: ['schedule-list'],
    queryFn: () => ScheduleService.getListSchedule(true)
  })

  return (
    <SafeAreaView className="h-full bg-white">
      {scheduleListQuery.isPending ?
        <Loading texts={[{
          condition: true,
          text: 'Đang tải...'
        }]}
        />
        :
        <Schedule
          data={scheduleListQuery.data.data.items}
          selected={dateToYYYYMMDD(new Date())}
          touchFn={(id: string) => router.push({
            pathname: '/(nav)/calendar/[schedule_details]',
            params: {
              schedule_details: id,
              data: JSON.stringify(scheduleListQuery.data.data.items.find((i: ScheduleResponseType) => i.id == id))
            }
          })}
        />
      }

    </SafeAreaView>
  );
}
