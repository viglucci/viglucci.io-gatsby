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

import { rhythm } from "../utils/typography";

const Bio = () => {
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
      <Image
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
      />
      <div>
        <div>
          Kevin is a software engineer from Austin, Texas. Kevin works at {" "}
          <OutboundLink className="text-blue-300" target="_blank" rel="noopener noreferrer" href="https://blizzard.com">
            Blizzard Entertainment
          </OutboundLink>
          {" "}
          where he builds tools, APIs, and experiences that support
          {" "}
          <OutboundLink className="text-blue-300" target="_blank" rel="noopener noreferrer" href="https://worldofwarcraft.com">
            World of Warcraft
          </OutboundLink>
          {" "}
          on the web.
          <br />
          <span
            style={{
              display: "block",
              paddingTop: 5,
            }}
          >
            You can find Kevin around the web on{" "}
            <OutboundLink className="text-blue-300" target="_blank" rel="noopener noreferrer" href={social.twitter.url}>
              Twitter
            </OutboundLink>
            ,{" "}
            <OutboundLink className="text-blue-300" target="_blank" rel="noopener noreferrer" href={social.linkedin.url}>
              Linkedin
            </OutboundLink>
            , and{" "}
            <OutboundLink className="text-blue-300" target="_blank" rel="noopener noreferrer" href={social.github.url}>
              Github
            </OutboundLink>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default Bio;
