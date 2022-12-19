import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeImgSize from 'rehype-img-size'

export default {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism, [rehypeImgSize, { dir: 'public'}]],
    providerImportSource: '@mdx-js/react',
}
