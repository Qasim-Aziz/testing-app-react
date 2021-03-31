/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable import/extensions */

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { notification } from 'antd'
import API_END_POINT from '../env'
// const API_END_POINT = 'https://application.cogniable.us/apis/graphql'

const httpLink = createHttpLink({
  uri: API_END_POINT,
})

const errorLink = onError(({ graphQLErrors, networkError, response, operation, forward }) => {
  if (graphQLErrors) {
    // graphQLErrors.forEach(({ message, locations, path }) =>
    //   notification.success({
    //     message: message,
    //     description: message,
    //   })
    // );
  }
})

const httperrorLink = errorLink.concat(httpLink)

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = ''
  if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
    token = JSON.parse(localStorage.getItem('token'))
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      database: 'india',
      Authorization: token ? `JWT ${token}` : '',
    },
  }
})

const authhttperrorLink = authLink.concat(httperrorLink)

export default new ApolloClient({
  link: authhttperrorLink,
  cache: new InMemoryCache(),
})
