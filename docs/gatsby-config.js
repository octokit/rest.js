module.exports = {
  // https://www.gatsbyjs.org/docs/how-gatsby-works-with-github-pages/
  pathPrefix: "/rest.js",
  siteMetadata: {
    title: `Octokit.js`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `api`,
        path: `${__dirname}/src/pages/api`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: null,
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in src/layouts/index.js
              // right after importing the prism color scheme:
              //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: false,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        // Fields to index
        fields: [`title`, `name`, `scope`, `route`, `method`],
        // How to resolve each field`s value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields` values
          MarkdownRemark: {
            title: (node) => node.frontmatter.title,
            name: (node) => node.frontmatter.name,
            slug: (node) =>
              `#${node.frontmatter.scope ? node.frontmatter.scope + "-" : ""}${
                node.fields.idName
              }`,
            route: (node) => `${node.frontmatter.route}`,
            method: (node) => `${node.frontmatter.example}`,
            type: (node) => node.frontmatter.type || "API",
            version: (node) => node.fields.version,
          },
        },
      },
    },
    {
      resolve: "gatsby-plugin-versioned-docs",
      options: {
        currentVersion: "v21", // configure the path for the current version
        versions: [
          {
            name: "v16", // the path of the older version
            branch: "16.x", // older versions specify a branch name for this repo
            endpoints: "2.x", // ...and one for the endpoint methods
          },
          {
            name: "v17", // the path of the older version
            branch: "17.x", // older versions specify a branch name for this repo
            endpoints: "3.x", // ...and one for the endpoint methods
          },
          {
            name: "v18", // the path of the older version
            branch: "18.x", // older versions specify a branch name for this repo
            endpoints: "5.x", // ...and one for the endpoint methods
          },
          {
            name: "v19", // the path of the older version
            branch: "19.x", // older versions specify a branch name for this repo
            endpoints: "7.x", // ...and one for the endpoint methods
          },
          {
            name: "v20", // the path of the older version
            branch: "20.x", // older versions specify a branch name for this repo
            endpoints: "10.x", // ...and one for the endpoint methods
          },
        ],
      },
    },
  ],
};
