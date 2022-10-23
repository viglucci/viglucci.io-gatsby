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
import defaultOpenGraphImage from '../../content/assets/2x1-og-image.png'

function SEO({ url, description, lang, meta, title, ogImage, ogImageWidth, ogImageHeight, twitterImage }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
            social {
              twitter {
                username
              }
            }
          }
        }
      }
    `
  );

  meta = meta || [];

  const metaDescription = description || site.siteMetadata.description;
  const ogImageUrl = site.siteMetadata.siteUrl + (ogImage || defaultOpenGraphImage);
  const twitterImageUrl = site.siteMetadata.siteUrl + (twitterImage || defaultOpenGraphImage);

  meta = [
    ...meta,
    {
      name: "google-site-verification",
      content: "1ZK7pf2xmibzm7XbahR32ornhr_wAYVIGqtxvZeJq_c"
    },
    {
      name: "description",
      content: metaDescription,
    },
    {
      name: "image",
      content: ogImageUrl
    },
    {
      property: "og:url",
      content: url,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: metaDescription,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:creator",
      content: site.siteMetadata.social.twitter.username,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: metaDescription,
    },
    {
      name: "twitter:image",
      content: twitterImageUrl
    },
  ];

  if (ogImage) {
    meta = [
      ...meta,
      {
        property: "og:image",
        content: ogImageUrl
      },
      {
        property: `og:image:width`,
        content: ogImageWidth,
      },
      {
        property: `og:image:height`,
        content: ogImageHeight,
      }
    ];
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      link={[]}
      meta={meta}
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
  url: PropTypes.string.isRequired
};

export default SEO;
