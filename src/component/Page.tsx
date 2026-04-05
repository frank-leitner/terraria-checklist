import React from 'react'
import { Chapter } from '../type/chapter'
import { Collection } from '../type/collection'
import { Page as PageType } from '../type/page'
import ChapterPage from './ChapterPage'
import CollectionPage from './CollectionPage'
import HomePage from './HomePage'
import './Page.scss'

interface PageProps {
  page: PageType | null | undefined
}

const Page = ({ page }: PageProps): JSX.Element => {
  return (
    <main id="main-content" tabIndex={-1}>
      {page?.type === 'chapter' && <ChapterPage page={page.content as Chapter} />}
      {page?.type === 'collection' && <CollectionPage page={page.content as Collection} />}
      {!page && <HomePage />}
    </main>
  )
}

export default Page
