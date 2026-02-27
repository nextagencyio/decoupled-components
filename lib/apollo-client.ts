import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

function createApolloClient() {
  const isServer = typeof window === 'undefined'

  return new ApolloClient({
    ssrMode: isServer,
    link: new HttpLink({
      uri: drupalUrl ? `${drupalUrl}/graphql` : '/api/graphql',
      credentials: 'same-origin',
      // On the server, tag fetch requests so revalidateTag('drupal') clears the Data Cache
      ...(isServer && {
        fetch: (uri: RequestInfo | URL, options?: RequestInit) =>
          fetch(uri, { ...options, next: { tags: ['drupal'] } } as RequestInit),
      }),
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
  // On the server, always create a fresh client to avoid stale in-memory cache
  if (typeof window === 'undefined') return createApolloClient()

  // On the client, reuse the singleton
  if (!apolloClient) apolloClient = createApolloClient()
  return apolloClient
}
