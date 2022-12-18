import { serialize } from 'next-mdx-remote/serialize'
import { getAllArticles } from '@/lib/getAllArticles'
import { ArticleLayout } from '@/components/ArticleLayout'
import mdxConfig from '../../../mdx-config.mjs'

export async function getStaticPaths() {
    const articles = await getAllArticles();
    return {
        paths: articles.map((article) => ({
            params: {
                slug: article.slug,
            },
        })),
        fallback: false,
    }
}

export async function getStaticProps(context) {
    const articles = await getAllArticles();
    const { contents, ...rest } = articles.find((article) => {
        return article.slug === context.params.slug;
    });
    const mdxSource = await serialize(contents, {
        mdxOptions: mdxConfig,
    })
    return {
        props: {
            source: mdxSource,
            meta: rest,
        },
    }
}

export default (props) => <ArticleLayout meta={props.meta} {...props} />