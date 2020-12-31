import React from 'react'
import { Typography, Empty, Badge } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Spinner from '../../Spinner'

const { Text } = Typography

const GET_INVOICES = gql`
  query getInvoices($from: Date, $to: Date, $status: ID) {
    getInvoices(date_Gte: $from, date_Lte: $to, status: $status) {
      edges {
        node {
          id
          invoiceNo
          issueDate
          dueDate
          amount
          clinic {
            id
            schoolName
          }
          status {
            id
            statusName
          }
        }
      }
    }
  }
`

const SingleRecord = ({ invoiceNo, schoolName, status, issueDate }) => {
  let statusClass = 'processing-badge'
  switch (status) {
    case 'Paid':
      statusClass = 'success-badge'
      break
    case 'Pending':
      statusClass = 'warning-badge'
      break
    case 'Canceled':
      statusClass = 'danger-badge'
      break
    case 'Overdue':
      statusClass = 'processing-badge'
      break
    default:
      statusClass = 'processing-badge'
  }

  return (
    <a className="hover_me_item single-row" href="#/invoices">
      <div style={{ flex: 3 }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>{invoiceNo}</span>
        <span style={{ color: '#888' }}> - {schoolName}</span>
      </div>
      <span style={{ flex: 1.5, textAlign: 'right' }}>
        <Badge count={status} className={statusClass} />
        <span style={{ marginLeft: 5, color: '#222' }}>{issueDate}</span>
      </span>
    </a>
  )
}

const InvoicesCard = ({ status }) => {
  const { loading, data, error } = useQuery(GET_INVOICES)

  const filtered =
    data &&
    data.getInvoices &&
    data.getInvoices.edges &&
    data.getInvoices.edges.filter(({ node }) => {
      if (status && status !== 'All') {
        return node.status && node.status.statusName === status ? node : null
      }
      return node
    })

  return (
    <div>
      {error && <Text type="danger">Opp&apos;s their is a error</Text>}
      {loading && <Spinner />}
      {filtered && filtered.length === 0 && <Empty />}
      {filtered &&
        filtered.map(({ node }, index) => {
          const { length } = data.getInvoices.edges
          return index < 5 ? (
            <div
              key={node.id}
              style={{ borderBottom: index === length - 1 ? 'none' : '1px solid #ddd' }}
            >
              <SingleRecord
                invoiceNo={node.invoiceNo}
                schoolName={node?.clinic?.schoolName}
                status={node?.status?.statusName}
                issueDate={node.dueDate}
              />
            </div>
          ) : null
        })}
      {filtered && filtered.length > 5 && (
        <div className="more-row">
          <a href="#/clinicProfile">
            <span style={{ fontWeight: 'bold', fontSize: 12 }}>More...</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default InvoicesCard
