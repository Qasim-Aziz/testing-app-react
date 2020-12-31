import { GraphQLClient } from 'graphql-request'
// import { notification } from 'antd'

const graphQLClient = new GraphQLClient('http://development.cogniable.us/apis/school/graphql', {
  headers: {
    database: 'india',
  },
})

export default async function GetLearners() {
  const query = `query {students {
        edges {
            node {
            id,
            firstname,            
            }
        }
    }}`

  return graphQLClient
    .request(query)
    .then(data => {
      return data
    })
    .catch(err => {
      return err
    })
}
