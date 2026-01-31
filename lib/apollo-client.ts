import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: drupalUrl ? `${drupalUrl}/graphql` : '/api/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            nodeByPath: {
              keyArgs: ['path'],
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  })
}

let apolloClient: ApolloClient<any> | undefined

export function getApolloClient() {
  const _apolloClient = apolloClient ?? createApolloClient()

  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
