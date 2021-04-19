import React from 'react'
import { Page, Text, View, Document, Image, PDFViewer } from '@react-pdf/renderer'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import logo from '../../images/logo.JPG'

// const clinicAllDetails = gql`
//   query($id: ID) {
//     clinicAllDetails(pk: $id) {
//       details {
//         schoolName
//         email
//         address
//         logo
//       }
//     }
//   }
// `

const ClinicHeader = props => {
  const { schoolName, email, address } = props

  // const { data: clinicAllDetailsData, loading: clinicAllDetailsLoading } = useQuery(
  //   clinicAllDetails,
  //   {
  //     variables: {
  //       id: clinicId,
  //     },
  //   },
  // )

  // const { schoolName, email, address } = clinicAllDetailsData?.clinicAllDetails[0].details

  return (
    <View style={{ width: '30%' }}>
      <Image src={logo} style={{ width: '40%', paddingBottom: '12px', paddingTop: '5px' }} />
      <Text style={{ fontSize: 10, paddingBottom: '3px' }}>{schoolName}</Text>
      <Text style={{ fontSize: 10, paddingBottom: '3px' }}>{email}</Text>
      <Text style={{ fontSize: 10, paddingBottom: '3px' }}>{address}</Text>
    </View>
  )
}

export default ClinicHeader
