/* eslint-disable import/prefer-default-export */
const { default: gql } = require('graphql-tag')

export const CREATE_GROUP = gql`
  mutation($name: String!, $description: String) {
    addCommunityGroup(input: { name: $name, description: $description }) {
      details {
        id
        name
        description
        user {
          count
        }
      }
    }
  }
`

export const CREATE_BLOG_CATAGORY = gql`
  mutation($name: String!) {
    addCommunityCategories(input: { name: $name }) {
      details {
        id
        name
      }
    }
  }
`

export const GET_BLOG_CATAGOREYS = gql`
  query {
    communityGroupsCategoryList {
      id
      name
    }
  }
`

export const GET_GROUPS = gql`
  query {
    communityGroups {
      id
      name
      description
      user {
        count
      }
    }
  }
`

export const CREATE_BLOG = gql`
  mutation($title: String!, $group: ID!, $description: String!, $category: [ID!]!) {
    addCommunityBlogs(
      input: { title: $title, category: $group, description: $description, blogCategory: $category }
    ) {
      details {
        id
        title
        time
        description
        category {
          id
          name
        }
        likes {
          count
        }
        comments {
          count
        }
        blogCategory {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const UPDATE_COMMENT = gql`
  mutation($id: ID!, $comment: ID!) {
    editCommunityComment(input: { pk: $id, comment: $comment }) {
      details {
        id
        time
        comment
        user {
          id
          username
        }
      }
    }
  }
`

export const DELETE_COMMENT = gql`
  mutation($blogId: ID!, $commentId: ID!) {
    deleteCommunityComment(input: { pk: $blogId, comment: $commentId }) {
      status
      msg
    }
  }
`

export const UPDATE_BLOG = gql`
  mutation($id: ID!, $group: ID!, $title: String!, $category: [ID!]!, $description: String!) {
    updateCommunityBlogs(
      input: {
        pk: $id
        title: $title
        category: $group
        description: $description
        blogCategory: $category
      }
    ) {
      details {
        id
        title
        description
        category {
          id
          name
        }
        blogCategory {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const GET_BLOGS = gql`
  query($group: ID!) {
    communityBlogs(category: $group) {
      edges {
        node {
          id
          title
          time
          description
          category {
            id
            name
          }
          likes {
            count
          }
          comments {
            count
          }
          blogCategory {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

export const DELETE_BLOG = gql`
  mutation($id: ID!) {
    deleteCommunityBlogs(input: { pk: $id }) {
      status
      msg
    }
  }
`

export const IS_LIKED = gql`
  mutation($blogId: ID!, $userId: ID!) {
    isUserLikedBlog(input: { pk: $blogId, user: $userId }) {
      status
      msg
    }
  }
`

export const SEND_LIKE = gql`
  mutation($blogId: ID!, $userId: ID!) {
    communityLikesComments(input: { pk: $blogId, likes: [$userId] }) {
      details {
        likes {
          edges {
            node {
              id
              time
            }
          }
        }
        __typename
      }
      __typename
    }
  }
`

export const GET_COMMENTS = gql`
  query($blogId: ID!, $afterCursor: String) {
    communityBlogsDetails(id: $blogId) {
      comments(first: 5, after: $afterCursor) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            comment
            time
            user {
              id
              username
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`

export const SEND_COMMENT = gql`
  mutation($blogId: ID!, $userId: ID!, $message: String!) {
    communityLikesComments(
      input: { pk: $blogId, comments: [{ user: $userId, comment: $message }] }
    ) {
      status
      message
      details {
        comments {
          edges {
            node {
              id
              comment
              time
              user {
                id
                username
              }
            }
          }
        }
      }
    }
  }
`

export const UPDATE_GROUP = gql`
  mutation($groupId: ID!, $name: String!, $description: String!, $user: [ID!]!) {
    updateCommunityGroup(
      input: { pk: $groupId, name: $name, description: $description, users: $user }
    ) {
      details {
        id
        name
        description
        user {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

export const DELETE_GROUP = gql`
  mutation($id: ID!) {
    deleteCommunityGroup(input: { pk: $id }) {
      status
      msg
    }
  }
`

export const GROUP_DETAILS = gql`
  query($groupId: ID!) {
    communityGroupsDetails(id: $groupId) {
      id
      name
      description
    }
  }
`
