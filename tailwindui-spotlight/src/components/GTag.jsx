import Script from 'next/script'

export default function GTag() {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-MJER1L8FF3"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-MJER1L8FF3');
`}
            </Script>
        </>
    );
}