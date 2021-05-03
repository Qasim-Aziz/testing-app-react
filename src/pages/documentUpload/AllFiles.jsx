/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/no-unused-state */
import { gql } from 'apollo-boost'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import apolloClient from '../../apollo/config'
import AllFilesData from './AllFilesData'

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class AllFiles extends Component {
  state = {
    studentData: null,
    isFilterActive: false,
    mainFilteredData: [],
  }

  componentDidMount() {
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient
      .query({
        query: gql`{
      student(id: "${std}"){
        id
        firstname
        files{
            edges{
                node{
                    id
                    file
                    fileName
                    fileDescription
                }
            }
        }
      }
    }`,
      })
      .then(result => {
        this.setState({
          studentData: result.data.student,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const studentData = this.state
    return (
      <>
        <div className="all_file_container">
          <AllFilesData studentData={studentData} />
        </div>
      </>
    )
  }
}

export default AllFiles
