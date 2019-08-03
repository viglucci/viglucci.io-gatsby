/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
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
  `)

  const { author, social } = data.site.siteMetadata
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
        <p>
          Kevin is a software engineer from Austin, Texas who works at <a href="https://blizzard.com">Blizzard Entertainment</a> on the official <a href="https://worldofwarcraft.com">World of Warcraft</a> website and <a href="https://develop.battle.net/">APIs</a>.
        </p>
        <p>
          You can find Kevin around the internet on <a href={social.twitter.url}>Twitter</a>, <a href={social.github.url}>Github</a>, and <a href={social.linkedin.url}>Linkedin</a>.
        </p>
      </div>
    </div>
  )
}

export default Bio
