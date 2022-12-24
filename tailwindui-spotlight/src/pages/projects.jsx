import Link from 'next/link'
import Image from 'next/future/image'
import Head from 'next/head'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
// import logoAnimaginary from '@/images/logos/animaginary.svg'
// import logoCosmos from '@/images/logos/cosmos.svg'
// import logoHelioStream from '@/images/logos/helio-stream.svg'
// import logoOpenShuttle from '@/images/logos/open-shuttle.svg'
// import logoPlanetaria from '@/images/logos/planetaria.svg'

const projects = [
  {
    name: 'Bespoke CI',
    description:
      'Bespoke CI is a CI/CD solution designed specifically for game studios. While at Gamebreaking Studios I\'ve been working on developing core technology necessary for Bespoke CI, as well as maintaining and developing the products marketing website and Slack bot.',
    link: { href: 'https://bespokeci.dev', label: 'bespokeci.dev' },
  },
  {
    name: 'RSocket JS',
    description:
      'RSocket is a binary protocol for use on byte stream transports such as TCP, WebSockets, and Aeron. I\'ve been helping maintain the JS implementation of the protocol since 2020.',
    link: { href: 'https://github.com/rsocket/rsocket-js', label: 'github.com' },
  },
  {
    name: 'Unity RSocket',
    description:
      'Unity RSocket is a Unity compatible implementation of the RSocket protocol. I was the original author of the project and have been maintaining it since 2022.',
    link: { href: 'https://github.com/viglucci/unity-rsocket', label: 'github.com' },
  },
  {
    name: 'RSocket Website',
    description:
      'RSocket is an opensource project. I\'ve been helping maintain the website and documentation for the project since 2020.',
    link: { href: 'https://rsocket.io', label: 'rsocket.io' },
  },
  {
    name: 'worldofwarcraft.com',
    description:
      'While at Blizzard Entertainment I spent a lot of time working on the World of Warcraft website and Game Data APIs. I was responsible for the development the character profile pages, marketing & announcement websites, leaderbaords, public APIS, and more.',
    link: { href: 'https://worldofwarcraft.com', label: 'worldofwarcraft.com' },
  },
  {
    name: 'forlater.io',
    description:
      'forlater.io is a link saving application that I built for my own use. The application allows you to save links from your browser and mobile devices, organize them into folders, and then access them from any device.',
    link: { href: 'https://forlater.io', label: 'forlater.io' },
  },
]

function LinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

const InlineLink = ({ href, label, children, ...props }) => (
  <Link href={href} target="_blank" rel="noopener" className="inline font-medium transition text-zinc-400 hover:text-teal-500 dark:hover:text-teal-500 dark:text-zinc-200">
    <span className="relative">{children}</span>
  </Link>
);

export default function Projects() {
  return (
    <>
      <Head>
        <title>Projects - Kevin Viglucci</title>
        <meta
          name="description"
          content="Professional and personal projects that I've worked on over the years."
        />
      </Head>
      <SimpleLayout
        title="Professional and personal projects."
        intro={
          <span>
            My <InlineLink href={"https://github.com/viglucci"}>GitHub</InlineLink> has many repositories for random projects and experiments, but here are a few of the more notable professional and personal projects that I've worked on over the years.
          </span>
        }
      >
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <Card as="li" key={project.name}>
              {project.logo ? (
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={project.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
              ) : null}
              <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                <Card.Link href={project.link.href}>{project.name}</Card.Link>
              </h2>
              <Card.Description>{project.description}</Card.Description>
              <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                <LinkIcon className="h-6 w-6 flex-none" />
                <span className="ml-2">{project.link.label}</span>
              </p>
            </Card>
          ))}
        </ul>
      </SimpleLayout>
    </>
  )
}
