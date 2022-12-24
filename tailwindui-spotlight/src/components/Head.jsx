import NextHead from 'next/head'

export default function Head({ meta, children }) {
    const tags = meta?.map((m) => {
        return (
            <meta {...m} key={m.name || m.property} />
        )
    });
    return (
        <NextHead>
            {children}
            {tags}
        </NextHead>
    )
};