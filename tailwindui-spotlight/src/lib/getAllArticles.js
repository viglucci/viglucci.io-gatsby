import fs from 'fs/promises'
import glob from 'fast-glob'
import * as path from 'path'
import * as matter from 'gray-matter'

async function importArticle(articleFilename) {
  let { meta, default: component } = await import(
    `../content/articles/${articleFilename}`
  )
  return {
    slug: articleFilename.replace(/(\/index)?\.mdx$/, ''),
    meta,
    component
  }
}

async function loadArticle(articleFilename) {
  const fileContents = await fs.readFile(
    path.join(process.cwd(), 'src/content/articles', articleFilename),
    'utf8'
  )
  const { data: meta, content } = matter(fileContents);
  const article = {
    slug: articleFilename.replace(/(\/index)?\.mdx$/, ''),
    meta,
    contents: content
  };
  return article;
}

export async function getAllArticles() {
  let articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/content/articles'),
  })

  let articles = await Promise.all(articleFilenames.map(loadArticle))

  return articles.sort((a, z) => new Date(z.date) - new Date(a.date))
}
