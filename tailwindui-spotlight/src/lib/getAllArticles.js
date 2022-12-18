import fs from 'fs/promises';
import glob from 'fast-glob'
import * as path from 'path'

async function importArticle(articleFilename) {
  const contents = await fs.readFile(
    path.join(process.cwd(), 'src/content/articles', articleFilename),
    'utf8'
  )
  let { meta, default: component } = await import(
    `../content/articles/${articleFilename}`
  )
  return {
    slug: articleFilename.replace(/(\/index)?\.mdx$/, ''),
    ...meta,
    // component,
    contents
  }
}

export async function getAllArticles() {
  let articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/content/articles'),
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => new Date(z.date) - new Date(a.date))
}
