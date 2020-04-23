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
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div>
        <div>

          Kevin is a software engineer from Austin, Texas. During the day he supports {" "}
          <OutboundLink target="_blank" rel="noopener noreferrer" href="https://worldofwarcraft.com">
            World of Warcraft
          </OutboundLink>{" "} at {" "}
          <OutboundLink target="_blank" rel="noopener noreferrer" href="https://blizzard.com">
            Blizzard Entertainment
          </OutboundLink>
          , and on nights and weekends he is building {" "}
          <OutboundLink target="_blank" rel="noopener noreferrer" href="https://forlater.io">
            forlater.io
          </OutboundLink>.
          <br />
          <span
            style={{
              display: "block",
              paddingTop: 5,
            }}
          >
            You can find Kevin around the internet on{" "}
            <OutboundLink target="_blank" rel="noopener noreferrer" href={social.twitter.url}>
              Twitter
            </OutboundLink>
            ,{" "}
            <OutboundLink target="_blank" rel="noopener noreferrer" href={social.linkedin.url}>
              Linkedin
            </OutboundLink>
            , and{" "}
            <OutboundLink target="_blank" rel="noopener noreferrer" href={social.github.url}>
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
