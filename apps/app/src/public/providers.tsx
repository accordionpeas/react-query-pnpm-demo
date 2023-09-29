import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query'
import { queryClient } from './query-client'
import { isServer } from './utils'

type ProviderProps = {
  query: unknown
  children: ReactNode
}

const Providers = ({ query, children }: ProviderProps) => {
  const queryClientToUse = isServer ? new QueryClient() : queryClient

  return (
    <QueryClientProvider client={queryClientToUse}>
      <Hydrate state={query}>
        {children}
      </Hydrate>
    </QueryClientProvider>
  )
}

export default Providers
