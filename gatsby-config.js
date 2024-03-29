const SITE_URL = "https://viglucci.io/";

module.exports = {
  siteMetadata: {
    title: `viglucci.io`,
    author: `Kevin Viglucci`,
    description: `Kevin is software engineer working in the games industry, and this is his blog.`,
    siteUrl: SITE_URL,
    social: {
      twitter: {
        username: `@kviglucci`,
        url: `https://twitter.com/kviglucci`
      },
      github: {
        username: `viglucci`,
        url: `https://github.com/viglucci`
      },
      linkedin: {
        username: `kevin-viglucci-a0010078`,
        url: `https://www.linkedin.com/in/kevin-viglucci-a0010078/`
      }
    },
    disgus: {
      shortName: `viglucci-io`
    }
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "nofollow"
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          { resolve: `gatsby-remark-prismjs` },
          { resolve: `gatsby-remark-copy-linked-files` },
          { resolve: `gatsby-remark-smartypants` }
        ],
      },
    },
    { resolve: `gatsby-transformer-sharp` },
    { resolve: `gatsby-plugin-sharp` },
    { resolve: `gatsby-plugin-image` },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-88454306-1`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "viglucci.io RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Kevin Viglucci Portfolio & Blog`,
        short_name: `viglucci.io`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#252f3f`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    { resolve: `gatsby-plugin-offline` },
    { resolve: `gatsby-plugin-react-helmet` },
    { resolve: `gatsby-plugin-postcss` },
    {
      resolve: `gatsby-plugin-mailchimp`,
      options: {
        endpoint: 'https://viglucci.us18.list-manage.com/subscribe/post?u=67ef840f69d44e533a8ff6e5c&amp;id=21a097d753',
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: SITE_URL,
      },
    },
  ],
}
