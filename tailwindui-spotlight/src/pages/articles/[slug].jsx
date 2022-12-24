import { serialize } from 'next-mdx-remote/serialize'
import { getAllArticles } from '@/lib/getAllArticles'
import { ArticleLayout } from '@/components/ArticleLayout'
import mdxConfig from 'mdx-config.mjs'

export async function getStaticPaths() {
    const articles = await getAllArticles();
    const paths = articles.map((article) => ({
        params: {
            slug: article.slug,
        },
    }));
    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps(context) {
    const articles = await getAllArticles();
    const { contents, ...rest } = articles.find((article) => {
        return article.slug === context.params.slug;
    });
    const { ...mdxSource } = await serialize(contents, {
        mdxOptions: mdxConfig,
        parseFrontmatter: false
    })
    return {
        props: {
            source: mdxSource,
            ...rest
        },
    }
}

const ArticlePage = (props) => {
    return <ArticleLayout meta={props.meta} {...props} />;
}

export default ArticlePage
