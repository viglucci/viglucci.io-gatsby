import React from "react";
import { Link, graphql } from "gatsby";
import { DiscussionEmbed } from "disqus-react";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { rhythm, scale } from "../utils/typography";

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        disgus {
          shortName
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        ogimage {
          childImageSharp {
            fixed {
              src
            }
          }
        }
      }
    }
  }
`;

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const disgusShortName = this.props.data.site.siteMetadata.disgus.shortName;
    const { previous, next } = this.props.pageContext;
    const { title, description, ogimage } = post.frontmatter;
    const ogImagePath = ogimage && ogimage.childImageSharp.fixed.src;
    const disqusConfig = {
      shortname: disgusShortName,
      config: {
        identifier: this.props.location.href,
        url: this.props.location.href,
        title,
      },
    };

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={title} description={description || post.excerpt} image={ogImagePath} />
        <h1
          style={{
            marginTop: rhythm(1),
            marginBottom: 0,
          }}
        >
          {post.frontmatter.title}
        </h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
          }}
        >
          {post.frontmatter.date}
        </p>
        <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <DiscussionEmbed {...disqusConfig} />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    );
  }
}

export default BlogPostTemplate;
