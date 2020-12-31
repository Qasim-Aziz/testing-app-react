import { GraphQLClient } from 'graphql-request'

let token = ''
if (!(localStorage.getItem('token') === null) && localStorage.getItem('token')) {
  token = JSON.parse(localStorage.getItem('token'))
}

const client = new GraphQLClient('https://application.cogniable.us/apis/graphql', {
  headers: {
    database: 'india',
    Authorization: token ? `JWT ${token}` : '',
  },
})

export default client
