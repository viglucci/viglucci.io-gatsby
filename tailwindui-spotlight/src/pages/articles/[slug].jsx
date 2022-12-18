import { getAllArticles } from '@/lib/getAllArticles'

import { ArticleLayout } from '@/components/ArticleLayout'

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
    console.log(articles)
    const {
        meta,
        content,
    } = articles.find((article) => article.slug === context.params.slug);
    return {
        props: {
            
        },
    }
}

export default (props) => <ArticleLayout meta={props.meta} {...props} />