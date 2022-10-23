import React from "react";
import { Link, graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import Nav from "../components/nav";
import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import indexHeader from "../../content/assets/index-header.jpg";

const Header = () => {
  return (
    <div className="relative bg-gray-800 overflow-hidden">
      <div className="max-w-screen-xl mx-auto ">
        <div className="relative z-10 pb-8 bg-gray-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-800 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <Nav />
          <div className="mt-10 mx-auto max-w-screen-xl pl-2 pr-4 sm:mt-12 sm:pl-4 sm:pr-6 md:mt-16 lg:mt-20 lg:pl-6 lg:pr-10 xl:mt-28">
            <Bio avatar={false} />
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src={indexHeader} alt="" />
      </div>
    </div>
  );
};

const PostCard = (props) => {
  const {
    fields,
    frontmatter,
    excerpt
  } = props;
  let cardBody = frontmatter.description || excerpt;
  let { title, ogimage } = frontmatter;
  title = frontmatter.title || fields.slug;
  const image = ogimage?.childImageSharp?.gatsbyImageData;
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="flex-shrink-0">
        <Link to={fields.slug} className="block">
          <img className="h-48 w-full object-cover" src={getSrc(image)} alt="" />
        </Link>
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <Link style={{ boxShadow: `none` }} to={fields.slug} className="block">
            <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
              {title}
            </h3>
          </Link>
          <p className="mt-3 text-base leading-6 text-gray-500">
            {cardBody}
          </p>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex text-sm leading-5 text-gray-500">
            <time>
              {frontmatter.date}
            </time>
            <span className="mx-1">
              &middot;
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
    <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="relative max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-700 sm:text-4xl sm:leading-10 ">
            Recent Articles
          </h2>
        </div>
        <div className="mt-8 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {posts.map((post) => <PostCard {...post} key={post.fields.slug} />)}
        </div>
      </div>
    </div>
  );
};

class BlogIndex extends React.Component {
  render() {
    const { data, location } = this.props;
    const posts = data.allMarkdownRemark.edges.map(post => post.node);
    return (
      <Layout location={this.props.location} title={""}>
        <SEO title="Kevin Viglucci" url={location.href} />
        <Header />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <PostList posts={posts} />
        </div>
      </Layout>
    );
  }
};

export default BlogIndex;

export const pageQuery = graphql`{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          ogimage {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, layout: FIXED)
            }
          }
        }
      }
    }
  }
}
`;
