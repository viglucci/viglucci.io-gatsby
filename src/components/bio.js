/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import { OutboundLink } from "gatsby-plugin-google-analytics";

const Bio = ({
  avatar
}) => {
  if (typeof avatar === 'undefined') {
    avatar = true;
  }
  const data = useStaticQuery(graphql`query BioQuery {
  avatar: file(absolutePath: {regex: "/orc-selfie.jpg/"}) {
    childImageSharp {
      gatsbyImageData(width: 50, height: 50, layout: FIXED)
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
      {avatar && (<GatsbyImage
        image={data.avatar.childImageSharp.gatsbyImageData}
        alt={author}
        style={{
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
        className="mr-4" />)}
      <div>
        Hi, I'm Kevin and I am a software engineer from Austin, Texas. I'm currently working on games, tooling, and backend platform services for clients at {" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href="https://gamebreaking.com">
          Gamebreaking Studios
        </OutboundLink>.
        <br />
        <br />
        You can find me around the web on{" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href={social.twitter.url}>Twitter</OutboundLink>,{" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href={social.linkedin.url}>LinkedIn</OutboundLink>, and{" "}
        <OutboundLink className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" href={social.github.url}>GitHub</OutboundLink>, but Twitter is generally the best way to get ahold of me. Feel free to reach out if you ever want to chat 😄!
      </div>
    </div>
  );
};

export default Bio;
