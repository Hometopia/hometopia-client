import { FileService } from "@/api/FileService"
import { useQuery } from "@tanstack/react-query"

export const useImgQuery = (fileName: string) => {
  const imgQuery = useQuery({
    queryKey: ['imgQuery', fileName],
    queryFn: () => FileService.getFile(fileName)
  })

  return imgQuery
}