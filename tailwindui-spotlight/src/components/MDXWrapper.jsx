import { MDXProvider } from '@mdx-js/react'

const ResponsiveImage = (props) => {
    return (
        <Image
            alt={props.alt}
            layout="responsive"
            loading="lazy"
            {...props}
        />
    )
}

const components = {
    Image: ResponsiveImage,
    img: ResponsiveImage
}

export default function MDXWrapper({ children }) {
    return (
        <MDXProvider components={components}>
            {
                typeof children === 'function'
                    ? children({ components })
                    : children
            }
        </MDXProvider>
    );
}