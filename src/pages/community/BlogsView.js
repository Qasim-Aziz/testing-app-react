/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import { GET_BLOGS } from './query'
import BlogCard from './BlogCard'

export default ({ selectGroup }) => {
  const [getBlogs, { data: blogsData, error: blogsError, loading: blogsLoading }] = useLazyQuery(
    GET_BLOGS,
    {
      variables: {
        group: selectGroup,
      },
    },
  )

  useEffect(() => {
    if (selectGroup) {
      getBlogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectGroup])

  return (
    <div style={{ marginTop: 20 }}>
      {blogsLoading && 'Loading...'}
      {blogsError && 'Opps their something is wrong'}
      {blogsData &&
        blogsData.communityBlogs.edges.map(({ node }) => (
          <BlogCard node={node} key={node.id} group={selectGroup} />
        ))}
    </div>
  )
}
