import React from "react";
import { graphql } from "gatsby";

export default function Index(props) {
  const { currentVersion } = props.data.sitePlugin.pluginOptions;
  return <a href={`${currentVersion}/`}>Redirecting to /{currentVersion}...</a>;
}

export function Head(props) {
  const { currentVersion } = props.data.sitePlugin.pluginOptions;
  return (
    <>
      {/* redirect the root path "/" to the current version */}
      <meta http-equiv="refresh" content={`0;url=./${currentVersion}/`} />
      <script>{`if (window.location.hash) { window.location.pathname += "${currentVersion}/"; }`}</script>
    </>
  );
}

export const pageQuery = graphql`
  {
    # query for the configured current version slug
    sitePlugin(name: { eq: "gatsby-plugin-versioned-docs" }) {
      pluginOptions
    }
  }
`;
