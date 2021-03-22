/* eslint-disable import/extensions */
import { GraphQLClient } from 'graphql-request'
import API_END_POINT from './env'

let token = ''
if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
  token = JSON.parse(localStorage.getItem('token'))
}

const client = new GraphQLClient(API_END_POINT, {
  headers: {
    database: 'india',
    Authorization: token ? `JWT ${token}` : '',
  },
})

export default client
