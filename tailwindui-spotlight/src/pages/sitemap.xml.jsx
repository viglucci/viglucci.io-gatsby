import { getAllArticles } from "@/lib/getAllArticles";

const WEBSITE_URL = 'https://viglucci.io';

function generateSiteMap({ articles, pages }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
        .map(({ slug }) => {
        return `
        <url>
            <loc>${`${WEBSITE_URL}/${slug}`}</loc>
        </url>
    `;
        })
        .join('')}
    ${articles
       .map(({ slug }) => {
         return `
       <url>
           <loc>${`${WEBSITE_URL}/articles/${slug}`}</loc>
       </url>
    `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    const articles = await getAllArticles();
    const pages = [
        { slug: '' },
        { slug: 'articles' },
        { slug: 'about' },
        { slug: 'uses' },
        { slug: 'projects' },
    ];

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap({ articles, pages });

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;