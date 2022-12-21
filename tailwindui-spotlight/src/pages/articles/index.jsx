import Head from 'next/head'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles } from '@/lib/getAllArticles'
import { formatDate } from '@/lib/formatDate'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.meta.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.meta.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.meta.date)}
        </Card.Eyebrow>
        <Card.Description>{article.meta.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.meta.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.meta.date)}
      </Card.Eyebrow>
    </article>
  )
}

export default function ArticlesIndex({ articles }) {
  return (
    <>
      <Head>
        <title>Articles - Kevin Viglucci</title>
        <meta
          name="description"
          content="All of my long-form thoughts on programming/software development, gamedev, and more, collected in chronological order."
        />
      </Head>
      <SimpleLayout
        title="Thoughts on Software Development, Gamedev, and other topics."
        intro="All of my long-form thoughts on programming/software development, gamedev, and more, collected in chronological order."
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </SimpleLayout>
    </>
  )
}

export async function getStaticProps() {
  const articles = await getAllArticles();
  const mappedArticles = articles.map(({ component, ...meta }) => {
    return meta
  });
  return {
    props: {
      articles: mappedArticles,
    },
  }
}
