import { PageResponseType } from "@/api/types/response"
import { useEffect, useState } from "react"

type UseInfiniteScrollPropsType = {
  fetchFn: (page: number, size: number) => Promise<any>,
  pageSize: number
}
const VIRTUAL_LIST_MAX = 40
export default function useInfiniteScroll<T>({ fetchFn, pageSize = 10 }: UseInfiniteScrollPropsType) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<T[]>([])
  const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false)
  const [isLastPage, setLastPage] = useState<boolean>(false)

  //
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(pageSize)

  const fetchData = async () => {
    setIsLoading(true)
    await fetchFn(page, size).then((res) => {
      if (res !== null) {
        setData([...data, ...res.data.items])
        if (data.length > VIRTUAL_LIST_MAX) {
          setData(data.slice(data.length - size))
        }
        res.data.pageIndex === res.data.totalPages ? setLastPage(true) : setPage(prev => prev + 1)
        setIsLoading(false)
        !isFirstPageReceived && setIsFirstPageReceived(true)

      }
    })
  }
  const fetchNextPage = () => {
    if (isLastPage) {
      // End of data.
      return
    }
    fetchData()
  };

  const fetchPreviousPage = () => {
    if (isFirstPageReceived || data.length > VIRTUAL_LIST_MAX) {
      // End of data.
      return
    }
    fetchData()
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data, setData,
    isLoading,
    isFirstPageReceived,
    isLastPage,
    fetchNextPage,
    fetchPreviousPage
  }

}