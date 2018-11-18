import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'

const IndexPage = ({ data }) => (
  <Layout>
    <h2>Classical Music Catalogue</h2>
    <table>
      <thead>
        <tr>
          <th>Track</th>
          <th>Artist</th>
        </tr>
      </thead>
      <tbody>
      {data.allClassical.edges.map(({ node }) => (
        <tr key={ `track-${node.TrackId}` }>
          <td>{ node.Track }</td>
          <td>{ node.Artist }</td>
        </tr>
      ))}
      </tbody>
    </table>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allClassical(sort: {fields: [Artist], order: ASC}) {
      edges {
        node {
          id
          TrackId
          Track
          Artist
          Album
          Genre
        }
      }
    }
  }
`
