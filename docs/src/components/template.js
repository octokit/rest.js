import React from "react";

import { graphql } from "gatsby";

import IndexPage from "./index-page";

export default function Template({ data, pageContext }) {
  return <IndexPage version={pageContext.version} data={data} />;
}

export function Head() {
  return (
    <>
      <meta charset="utf-8" />
      <title>octokit/rest.js</title>
    </>
  );
}

export const query = graphql`
  query TemplateQuery($version: String, $endpoints: String) {
    # staticMethods are pages sourced from this repo
    staticMethods: allMarkdownRemark(
      filter: { fields: { version: { eq: $version } } }
      sort: { fields: { slug: ASC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
          }
          html
          fields {
            idName
          }
        }
      }
    }

    # endpointScopes are groups of pages sourced
    # from https://github.com/octokit/plugin-rest-endpoint-methods.js
    endpointScopes: allMarkdownRemark(
      filter: { fields: { version: { eq: $endpoints } } }
      sort: { fields: { slug: ASC } }
    ) {
      # endpoints are grouped by the directory they reside in, as
      # configured in the onCreateNode hook in gatsby-node.js
      group(field: { fields: { parentRelativeDirectory: SELECT } }) {
        fieldValue # this is the parentRelativeDirectory field
        edges {
          node {
            id
            html
            fields {
              idName
            }
            # use the contents of the document's h1 tag as its link text
            # in the sidebar
            headings(depth: h1) {
              value
            }
          }
        }
      }
    }
  }
`;
