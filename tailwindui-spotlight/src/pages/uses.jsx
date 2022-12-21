import Head from 'next/head'
import Link from 'next/link'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({ title, href, children }) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export default function Uses() {
  return (
    <>
      <Head>
        <title>Uses - Kevin Viglucci</title>
        <meta
          name="description"
          content="Software, tools, and other things I use to do my work or would recommend."
        />
      </Head>
      <SimpleLayout
        title="Software, tools, and other things I use to do my work or would recommend."
        intro="Nobody asks me about the things I use to build software, stay productive, or otherwise, but if they did, this is the page I would send them. Here's a list of stuff and things I use daily."
      >
        <div className="space-y-20">
          <ToolsSection title="Workstation">
            <Tool title="NZXT Windows PC">
              Gamedevelopment happens almost exclusively on Windows, so I have a relatively powerful Windows PC from NZXT that I use for my day to day work.
              <ul className="list-inside list-disc mt-4">
                <li>AMD Ryzen 9 3900X</li>
                <li>NVIDIA GeForce RTX 3600</li>
              </ul>
            </Tool>
            <Tool title="Dell S2716DG Monitor">
              This is my main monitor. It's a 1440p 144Hz monitor that I use for everything. It's not really anything special, but gets the job done.
            </Tool>
            <Tool title="ASUS VN247 Monitor x2">
              I originally bought three of these monitors almost 10 years ago when I wanted to try out a triple monitor setup for WoW. At the time these monitors offered what was considered a very thin bezel. I've since replaced one of them with a 4K monitor (see above), but I still use the other two for side monitors in a triple monitor setup.
            </Tool>
            <Tool title="Ducky Shine 7 Gunmetal RGB LED Double Shot PBT Mechanical Keyboard">
              This keyboard is great. I originally bought a different Ducky keyboard, but then I dropped my absolute brick of a phone on the keyboard and it <a href="https://twitter.com/kviglucci/status/1408817692786794498">snapped one of the keys off</a>.
            </Tool>
            <Tool title="Razer Naga Chroma Mouse">
              I've used Razer mice and keyboards for a few years. I'm probably done buying their keyboards, but I'll probably stick with their mice for a while, or at least until I find something better. The extra buttons on the side come in handy when gaming, which I'm still doing a fair bit of.
            </Tool>
            <Tool title="Logitech c92 Pro Stream Webcam">
              This is the same webcam that pretty much everyone else bought when they started working from home during the pandemic. It seems to be a good camera and sufficiently lets me show my cats while in meetings.
            </Tool>
            <Tool title="BenQ ScreenBar Plus e-Reading LED Computer Monitor Light">
              This desk lamp has been awsesome. 10/10 would buy again. Seems to help with eyestrain and lights up what has historically been a very dim and dark desk, and I don't have much natural light that lands on my desk.
            </Tool>
            <Tool title="Herman Miller Aeron Chair">
              I've been using a Herman Miller Aeron Chair for a few years now. Have tried a bunch of other chairs but this is what i'm using right now. I would be interested in trying a Steelcase Gesture chair some day.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Development tools">
            <Tool title="Visual Studio Code">
              Depending on the project, I use either VS Code or one of the Jetbrains IDEs. There are small difference between the two that I prefer in each, but I kind of hop back and forth between them depending on what I'm doing.
            </Tool>
            <Tool title="Jetbrains Intellij">
              I use the full suite of Jetbrains IDE products, and if I had to pick a single IDE it would probably be Intellij. However, like I stated above I sometimes jump back and forth between this and VS Code.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Design/Editing">
            <Tool title="Photoshop">
              I've been using photoshop for a number of years, originally to design websites when I was in highschool. I wouldn't say I'm good in any way, but I've found anytime I don't have a Photoshop license I end up missing it, so here we are.
            </Tool>
            <Tool title="Davinci Resolve">
              I'm even worse at video editing than I am photo/image editing, but when I do have to edit a video I've been trying to learn Davinci Resolve.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Productivity">
            <Tool title="Jira">
              I've had a Atlassian/Jira account for a number of years. Jira is my preferred project management/tracking solution, however I arguebly have not tried many other solutions.
            </Tool>
            <Tool title="TickTick">
              A friend put me onto TickTick for daily task/todo list tracking. It gets the job done.
            </Tool>
            <Tool title="ForLater">
              This is actually a tool that I built for myself. I wanted a way to save links to articles, videos, etc. that I wanted to read/watch later. I built a simple web app that allows me to save these links, often directly from my phone, and then I can access them from any device.
              <p className="mt-4">
                <Link
                  href={"https://forlater.io?utm_source=viglucci.io&utm_medium=referral&utm_campaign=uses"}
                  className="text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
                  target={"_blank"}
                >
                  <span>forlater.io</span>
                </Link>
              </p>
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
