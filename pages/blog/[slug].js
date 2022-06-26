import fs from 'fs'
import matter from 'gray-matter'
import Link from 'next/link'
import { marked } from 'marked'
import path from 'path'

export default function PostPage({
  slug,
  frontmatter: { title, date, cover_image },
  content,
}) {
  return (
    <div>
      <Link href="/">
        <a className="btn btn-back">Go Back</a>
      </Link>
      <div className="card card-page">
        <h1 className="post-title">{title}</h1>
        <div className="post-date">posted on {date}</div>
        <img src={cover_image} alt="image" />
        <div className="post-body">
          <div
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map(file => ({
    params: {
      slug: file.replace('.md', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  )

  const { data: frontmatter, content } = matter(markdownWithMeta)

  return {
    props: {
      slug,
      frontmatter,
      content,
    },
  }
}
