/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Image from "gatsby-image";
import { OutboundLink } from "gatsby-plugin-google-analytics";

const Bio = ({
  avatar
}) => {
  if (typeof avatar === 'undefined') {
    avatar = true;
  }
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/orc-selfie.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter {
              url
            }
            github {
              url
            }
            linkedin {
              url
            }
          }
        }
      }
    }
  `);

  const { author, social } = data.site.siteMetadata;
  return (
    <div className="flex bg-gray-800 rounded-md p-4 leading-6 text-gray-300">
      {avatar && (<Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
        className="mr-4"
      />)}
      <div>
        Kevin is a software engineer from Austin, Texas working at {" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href="https://blizzard.com">
          Blizzard Entertainment
        </OutboundLink>
        {" "}
        where he builds tools, APIs, and experiences that support
        {" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href="https://worldofwarcraft.com">World of Warcraft</OutboundLink>.
        You can find Kevin around the web on{" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href={social.twitter.url}>Twitter</OutboundLink>,{" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href={social.linkedin.url}>LinkedIn</OutboundLink>, and{" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href={social.github.url}>GitHub</OutboundLink>.
      </div>
    </div>
  );
};

export default Bio;
