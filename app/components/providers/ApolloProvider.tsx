'use client'

import { ApolloProvider as BaseApolloProvider } from '@apollo/client'
import { getApolloClient } from '@/lib/apollo-client'

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const client = getApolloClient()

  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  )
}
