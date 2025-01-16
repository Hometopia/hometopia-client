import { View, Text } from 'react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
    mutations: {
      onError: (error) => {
        handleGlobalError(error)
      },
    },
  },
})

const handleGlobalError = (error: any) => {
  if (error instanceof Error) {
    console.log(error)
  } else {
    console.log('Unknown error: ', error)
  }
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}