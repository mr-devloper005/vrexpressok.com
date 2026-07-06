import Link from 'next/link'
import {
  Camera,
  ChevronRight,
  FileText,
  Folder,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MessagesSquare,
  PlaySquare,
  UsersRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { getEditableCategory, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'
const panel = 'bg-white'
const darkPanel = 'bg-[#2d4154] text-white'

function stablePosts(posts: SitePost[], timeSections: HomeTimeSection[] = []) {
  const seen = new Set<string>()
  const output: SitePost[] = []
  for (const post of [...posts, ...timeSections.flatMap((section) => section.posts)]) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    output.push(post)
  }
  return output
}

function imageFor(post?: SitePost | null) {
  return getEditablePostImage(post) || '/placeholder.svg?height=900&width=1400'
}

function hrefFor(task: TaskKey, route: string, post: SitePost) {
  return postHref(task, post, route)
}

function byLine(post: SitePost, index = 0) {
  const author = post.authorName || 'Member'
  const hour = 8 + (index % 18)
  return `By ${author}, ${hour} hours ago`
}

function statsFor(post: SitePost, index: number) {
  const seed = (post.slug || post.id || post.title || String(index)).length + index
  return {
    comments: seed % 3,
    replies: seed % 2,
    views: 5 + ((seed * 17) % 590),
  }
}

function HeroBackground({ posts }: { posts: SitePost[] }) {
  const hero = posts.find((post) => !imageFor(post).includes('placeholder')) || posts[0]
  return (
    <div className="absolute inset-0">
      <img src={imageFor(hero)} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,242,242,0.16),rgba(33,94,97,0.22)_48%,rgba(29,33,40,0.22))]" />
    </div>
  )
}

export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = stablePosts(posts, timeSections)

  return (
    <section className="relative">
      <div className="relative h-[510px] overflow-hidden sm:h-[560px]">
        <HeroBackground posts={pool} />
        <div className={`${container} relative flex h-full flex-col items-center justify-center text-center text-white`}>
          <p className="text-4xl font-light uppercase leading-none tracking-normal text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.38)] sm:text-6xl">
            Where members
          </p>
          <h1 className="mt-2 text-5xl font-extrabold uppercase leading-none tracking-normal text-white drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] sm:text-7xl">
            Inspire each other
          </h1>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            <Link href="/profile" className="inline-flex items-center gap-2 rounded-md bg-[var(--slot4-accent)] px-6 py-3 text-xl font-bold text-white shadow-sm transition hover:brightness-95">
              <Heart className="h-6 w-6" /> Our Community
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-md bg-[var(--slot4-accent)] px-6 py-3 text-xl font-bold text-white shadow-sm transition hover:brightness-95">
              <Camera className="h-6 w-6" /> Join Us
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white py-3 text-center">
        <p className="px-4 text-2xl font-normal uppercase tracking-[0.04em] text-black sm:text-3xl">
          The Internet's Original Photograph Community, Since 1993
        </p>
      </div>
    </section>
  )
}

function RecentImage({ post, href, className = '' }: { post: SitePost; href: string; className?: string }) {
  return (
    <Link href={href} className={`group block overflow-hidden bg-[#dfe4ea] ${className}`}>
      <img src={imageFor(post)} alt={post.title || ''} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
    </Link>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = stablePosts(posts, timeSections).slice(0, 18)
  if (!pool.length) return null

  return (
    <section className="bg-[#eef0f5]">
      <div className={`${container}`}>
        <div className={`${panel} px-8 py-14 sm:px-12 lg:px-[50px]`}>
          <h2 className="text-4xl font-extrabold tracking-normal text-[var(--slot4-accent)]">Recent Images</h2>
          <p className="mt-2 text-base font-bold text-[#071421]">A collection of recent images uploaded by our community members.</p>
          <div className="mx-auto mt-11 grid max-w-[1010px] grid-cols-2 gap-8 sm:grid-cols-4">
            {pool.slice(0, 4).map((post, index) => (
              <RecentImage
                key={post.id || post.slug}
                post={post}
                href={hrefFor(primaryTask, primaryRoute, post)}
                className={index === 0 ? 'col-span-2 aspect-[11/6]' : index === 3 ? 'col-span-2 aspect-[3/2]' : 'aspect-[2/3]'}
              />
            ))}
          </div>
          <div className="mx-auto mt-10 grid max-w-[1010px] grid-cols-2 gap-8 sm:grid-cols-4">
            {pool.slice(4, 16).map((post) => (
              <RecentImage key={post.id || post.slug} post={post} href={hrefFor(primaryTask, primaryRoute, post)} className="aspect-[4/3]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const forumCategories = [
  { label: 'General Photography', href: '/article', icon: MessagesSquare },
  { label: 'Images', href: '/image', icon: ImageIcon },
  { label: 'Practice and Technique', href: '/pdf', icon: FileText },
  { label: 'Equipment', href: '/classified', icon: Camera },
  { label: 'Site and Community Help', href: '/sbm', icon: UsersRound },
  { label: 'Additional Topics', href: '/listing', icon: PlaySquare },
]

function TopicCard({ post, index, route, task }: { post: SitePost; index: number; route: string; task: TaskKey }) {
  const initials = (post.title || 'Topic').slice(0, 1).toUpperCase()
  const colors = ['bg-[#f0c46c]', 'bg-[#80795d]', 'bg-[#5f8bd4]', 'bg-[#a5cc59]']
  return (
    <Link href={hrefFor(task, route, post)} className="block rounded-md bg-white/5 p-5 transition hover:bg-white/10">
      <div className="flex gap-4">
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${colors[index % colors.length]} text-xs font-bold text-white`}>
          {initials}
        </span>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-extrabold leading-tight text-white">{post.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm font-medium leading-5 text-white/70">
            <Folder className="mr-1 inline h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <p className="mt-1 text-sm text-white/70">
            By {post.authorName || 'member'} <MessageCircle className="ml-2 inline h-3.5 w-3.5" /> {index + 2}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = stablePosts(posts, timeSections)
  const topics = pool.slice(0, 6)
  if (!pool.length) return null

  return (
    <section className="bg-[#eef0f5]">
      <div className={`${container} grid gap-5 lg:grid-cols-[1fr_340px]`}>
        <div className={`${panel} min-h-[640px] px-8 py-0 sm:px-12 lg:px-[50px]`}>
          <h2 className="text-4xl font-extrabold tracking-normal text-[var(--slot4-accent)]">Browse by Forum Category</h2>
          <div className="grid min-h-[560px] grid-cols-1 items-center gap-x-20 gap-y-16 py-12 sm:grid-cols-2">
            {forumCategories.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} href={item.href} className="group flex items-center gap-6">
                  <Icon className="h-9 w-9 shrink-0 text-[var(--slot4-accent)] opacity-55 transition group-hover:opacity-100" />
                  <span className="text-2xl font-extrabold text-black transition group-hover:text-[var(--slot4-accent)]">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
        <aside className={`${darkPanel} px-[50px] py-0`}>
          <h2 className="text-4xl font-extrabold leading-tight">Active Topics</h2>
          <p className="mt-2 text-base font-extrabold text-white">What the community is saying.</p>
          <div className="mt-11 grid gap-4">
            {topics.slice(0, 3).map((post, index) => (
              <TopicCard key={post.id || post.slug} post={post} index={index} route={primaryRoute} task={primaryTask} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = stablePosts(posts, timeSections)
  if (!pool.length) return null

  return (
    <section className="bg-[#eef0f5] pt-5">
      <div className={container}>
        <div className={`${darkPanel}`}>
          <h2 className="border-b border-white/10 px-5 py-6 text-2xl font-extrabold">Featured Topics</h2>
          <div>
            {pool.slice(0, 3).map((post, index) => (
              <Link key={post.id || post.slug} href={hrefFor(primaryTask, primaryRoute, post)} className="flex gap-4 border-b border-white/10 px-6 py-5 transition hover:bg-white/5">
                <img src={imageFor(post)} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-base font-extrabold text-white">{post.title}</h3>
                  <p className="mt-2 text-sm text-white/70">
                    <Folder className="mr-1 inline h-3.5 w-3.5" /> {getEditableCategory(post)}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    By {post.authorName || 'member'} <MessageCircle className="ml-3 inline h-3.5 w-3.5" /> {25 + index * 21}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded border border-[#d8dde3] bg-white">
          <h2 className="border-b border-[#d8dde3] px-4 py-3 text-lg font-extrabold text-[#071421]">Member Photo Albums</h2>
          <div className="flex gap-4 overflow-x-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {pool.slice(0, 10).map((post, index) => {
              const stats = statsFor(post, index)
              return (
                <Link key={post.id || post.slug} href={hrefFor(primaryTask, primaryRoute, post)} className="w-[240px] shrink-0 text-center">
                  <img src={imageFor(post)} alt="" className="h-[180px] w-full rounded object-cover" />
                  <h3 className="mt-4 truncate text-xl font-normal text-black">{post.title}</h3>
                  <p className="mt-2 truncate text-xs text-[#213040]">{byLine(post, index)}</p>
                  <p className="mt-2 flex items-center justify-center gap-5 text-xs text-[#44515f]">
                    <span><MessageCircle className="mr-1 inline h-3.5 w-3.5 fill-[#44515f]" />{stats.comments}</span>
                    <span><MessagesSquare className="mr-1 inline h-3.5 w-3.5" />{stats.replies}</span>
                    <span><Camera className="mr-1 inline h-3.5 w-3.5 fill-[#44515f]" />{stats.views}</span>
                  </p>
                </Link>
              )
            })}
            <Link href={primaryRoute} className="flex w-20 shrink-0 items-center justify-center bg-[#f4f2f2] text-black">
              <ChevronRight className="h-10 w-10" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#eef0f5] py-3">
      <div className="overflow-hidden rounded border border-[#d8dde3] bg-white">
        <div className="border-b border-[#d8dde3] px-4 py-3">
          <h2 className="text-lg font-extrabold text-[#071421]">Who's Online</h2>
        </div>
        <div className="px-5 py-5 text-sm text-black">
          <span className="font-normal">seancorley, Karim Ghantous, Vieri, ken_davis1, john_nell</span>
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded border border-[#d8dde3] bg-white">
        <div className="border-b border-[#d8dde3] px-4 py-3">
          <h2 className="text-lg font-extrabold text-[#071421]">Member Statistics</h2>
        </div>
        <div className="grid gap-6 px-6 py-8 text-center sm:grid-cols-3 sm:items-center">
          <div>
            <p className="text-2xl font-extrabold text-[#071421]">1,043,935</p>
            <p className="text-sm text-[#071421]">Total Members</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#071421]">11,367</p>
            <p className="text-sm text-[#071421]">Most Online</p>
          </div>
          <div className="flex items-center justify-center gap-4 border-[#dde3ea] sm:border-l">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#55ef55] text-3xl font-extrabold text-[#b44bd8]">Q</span>
            <div className="text-left">
              <p className="text-xs uppercase text-[#071421]">Newest Member</p>
              <p className="font-semibold text-[#071421]">Alaska at its best</p>
              <p className="text-sm text-[#071421]">Joined 10 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
