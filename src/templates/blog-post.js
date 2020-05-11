import React from "react";
import { Link, graphql } from "gatsby";
import { DiscussionEmbed } from "disqus-react";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Nav from "../components/nav";

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
      fields {
        slug
        readingTime {
          text
        }
      }
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
    const { fields } = post;
    const ogImagePath = ogimage && ogimage.childImageSharp.fixed.src;
    const disqusConfig = {
      shortname: disgusShortName,
      config: {
        identifier: this.props.location.href,
        url: this.props.location.href,
        title,
      }
    };

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Nav />
        <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <SEO title={title} description={description || post.excerpt} image={ogImagePath} />
          <article className="markdown">
            <h1 className="my-0 mb-2 text-4xl font-bold">
              {post.frontmatter.title}
            </h1>
            <div className="flex items-center mb-6">
              <div className="flex text-sm leading-5 text-gray-500">
                <time>
                  {post.frontmatter.date}
                </time>
                <span className="mx-1">
                  &middot;
                </span>
                <span>
                  {fields.readingTime.text}
                </span>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <hr className="my-4" />
          </article>

          <Bio />

          <div className="mt-8 mb-16">
            <DiscussionEmbed {...disqusConfig} />
          </div>

          <div>
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
                    <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150">
                      ← {previous.frontmatter.title}
                    </span>
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={next.fields.slug} rel="next">
                    <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150">
                      {next.frontmatter.title} →
                    </span>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BlogPostTemplate;
