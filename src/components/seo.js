/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import defaultOpenGraphImage from '../../content/assets/favicon.png'

function SEO({ description, lang, meta, title, image }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author,
            siteUrl
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const ogImageUrl = site.siteMetadata.siteUrl + (image || defaultOpenGraphImage);

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      link={[
        {
          rel: "stylesheet",
          href: "https://rsms.me/inter/inter.css"
        }
      ]}
      meta={[
        {
          property: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `twitter:card`,
          content: `summary`,
        },
        {
          property: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          property: `twitter:title`,
          content: title,
        },
        {
          property: `twitter:description`,
          content: metaDescription,
        },
        {
          property: "og:image",
          content: ogImageUrl
        },
        {
          property: "twitter:image",
          content: ogImageUrl
        },
        {
          property: "image",
          content: ogImageUrl
        },
        {
          name: "google-site-verification",
          content: "1ZK7pf2xmibzm7XbahR32ornhr_wAYVIGqtxvZeJq_c"
        }
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
