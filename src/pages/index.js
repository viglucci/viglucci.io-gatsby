import React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import indexHeader from "../../content/assets/index-header.jpg";

const PostCard = (props) => {
  const {
    fields,
    frontmatter,
    excerpt
  } = props;
  let { title, ogimage } = frontmatter;
  title = frontmatter.title || fields.slug;
  const image = ogimage.childImageSharp.fixed.src;
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <img className="h-48 w-full object-cover" src={image} alt="" />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <Link style={{ boxShadow: `none` }} to={fields.slug} className="block">
            <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
              {title}
            </h3>
            <p className="mt-3 text-base leading-6 text-gray-500">
              {excerpt}
            </p>
          </Link>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex text-sm leading-5 text-gray-500">
            <time>
              {frontmatter.date}
            </time>
            <span className="mx-1">
              &middot;
            </span>
            <span>
              {fields.readingTime.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostList = ({
  posts
}) => {
  return (
    <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3"></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10 ">
            Articles
          </h2>
          <div className="mt-3 sm:mt-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-center">
            <p className="text-xl leading-7 text-gray-500">
              Kevin enjoys writing about Software Architecture, Javascript, APIs, and various other topics. You can find his latest articles below.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {posts.map((post) => <PostCard {...post} key={post.fields.slug} />)}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="relative bg-gray-800 overflow-hidden">
      <div className="max-w-screen-xl mx-auto ">
        <div className="relative z-10 pb-8 bg-gray-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-800 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>
          <div className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-none md:text-6xl">
                Kevin Viglucci
              </h2>
              <div className="mt-3 max-w-3xl text-lg leading-6 text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Kevin is a software engineer from Austin, Texas where he works at Blizzard Entertainment building tools, APIs, and experiences that support World of Warcraft on the web.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src={indexHeader} alt="" />
      </div>
    </div>
  );
}

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    // const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges.map(post => post.node);
    return (
      <Layout location={this.props.location} title={""}>
        <SEO title="x" />
        <Header />
        {/* <Bio /> */}
        <PostList posts={posts} />
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
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
    }
  }
`;
