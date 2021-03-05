import React from "react";
import { Link, graphql } from "gatsby";
import { DiscussionEmbed } from "disqus-react";
import { getSrc } from "gatsby-plugin-image";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Nav from "../components/nav";

export const pageQuery = graphql`query BlogPostBySlug($slug: String!) {
  site {
    siteMetadata {
      title
      author
      disgus {
        shortName
      }
    }
  }
  markdownRemark(fields: {slug: {eq: $slug}}) {
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
          gatsbyImageData(placeholder: BLURRED, layout: FIXED)
        }
      }
      twitterimage {
        childImageSharp {
          gatsbyImageData(placeholder: BLURRED, layout: FIXED)
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
    const { title, description, ogimage, twitterimage } = post.frontmatter;
    const { fields } = post;
    const ogImagePath = ogimage && getSrc(ogimage.childImageSharp.gatsbyImageData);
    const ogImageWidth = ogimage && ogimage.childImageSharp.gatsbyImageData.width;
    const ogImageHeight = ogimage && ogimage.childImageSharp.gatsbyImageData.height;
    const twitterImagePath = twitterimage && getSrc(twitterimage.childImageSharp.gatsbyImageData);
    const url = this.props.location.href;
    const disqusConfig = {
      shortname: disgusShortName,
      config: {
        identifier: this.props.location.href,
        url,
        title,
      }
    };

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Nav />
        <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <SEO
            title={title}
            description={description || post.excerpt}
            ogImage={ogImagePath}
            ogImageHeight={ogImageWidth}
            ogImageWidth={ogImageHeight}
            twitterImage={twitterImagePath}
            url={url}
          />
          <article className="article prose lg:prose-lg">
            <h1 className="my-0 mb-2 leading-tight text-4xl font-bold">
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
          </article>

          <hr className="my-4" />

          <h3 className="mt-6 mb-4 text-xl font-semibold">About the author</h3>
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
                  <Link to={`/${previous.fields.slug}`} rel="prev">
                    <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150 mb-4 md:mb-0">
                      ← {previous.frontmatter.title}
                    </span>
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={`/${next.fields.slug}`} rel="next">
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
