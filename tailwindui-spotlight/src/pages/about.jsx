import fs from 'fs/promises'
import * as path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import Image from 'next/future/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'
import mdxConfig from '@/../mdx-config.mjs'

import { Prose } from '@/components/Prose'
import { Container } from '@/components/Container'
import {
  TwitterIcon,
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/photos/sword-orc-cropped.jpg'
import MDXWrapper from '@/components/MDXWrapper'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

function EmailLinkSection() {
  return (
    <SocialLink
      href="mailto:email@example.com"
      icon={MailIcon}
      className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
    >
      email@example.com
    </SocialLink>
  )
}

export async function getStaticProps(context) {
  const fileContents = await fs.readFile(
    path.join(process.cwd(), 'src/content/about.mdx'),
    'utf8'
  )
  const { ...mdxSource } = await serialize(fileContents, {
      mdxOptions: mdxConfig,
      parseFrontmatter: false
  })
  return {
      props: {
        source: mdxSource
      },
  }
}

export default function About(props) {
  return (
    <>
      <Head>
        <title>About - Kevin Viglucci</title>
        <meta
          name="description"
          content="I'm Kevin Viglucci. I live Austin, TX where I work remotely in the game industry."
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              I'm Kevin. I live in TX where I work in the game industry.
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <Prose className="mt-8">
                <MDXWrapper>
                  {({ components }) => {
                    return (
                      <MDXRemote {...props.source} components={components} />
                    )
                  }}
                </MDXWrapper>
              </Prose>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink href="https://twitter.com/kviglucci" icon={TwitterIcon}>
                Follow on Twitter
              </SocialLink>
              <SocialLink href="https://github.com/viglucci" icon={GitHubIcon} className="mt-4">
                Follow on GitHub
              </SocialLink>
              <SocialLink href="https://www.linkedin.com/in/kevinviglucci/" icon={LinkedInIcon} className="mt-4">
                Connect on LinkedIn
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </>
  )
}
