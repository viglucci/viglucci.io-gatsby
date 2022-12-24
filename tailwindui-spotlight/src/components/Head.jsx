import NextHead from 'next/head'
import { useRouter } from 'next/router'

export default function Head({ meta, children }) {
    let router = useRouter();
    const canonical = (`https://viglucci.io` + router.asPath).split("?")[0];
    const metaTags = meta?.map((m) => {
        return (
            <meta {...m} key={m.name || m.property} />
        )
    });
    return (
        <NextHead>
            {children}
            <link rel="canonical" href={canonical} />
            {metaTags}
        </NextHead>
    )
};