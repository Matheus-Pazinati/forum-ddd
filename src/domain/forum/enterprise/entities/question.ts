import { Slug } from './value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  set bestAnswerId(newBestAnswerId: UniqueEntityID | undefined) {
    this.props.bestAnswerId = newBestAnswerId
    this.touch()
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set title(newTitle: string) {
    this.props.title = newTitle
    this.props.slug = Slug.createSlugFromText(newTitle)
    this.touch()
  }

  get title() {
    return this.props.title
  }

  set content(newContent: string) {
    this.props.content = newContent
    this.touch()
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt) <= 3
  }

  get excerption() {
    return this.props.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    return (this.props.updatedAt = new Date())
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createSlugFromText(props.title),
        createdAt: new Date(),
      },
      id,
    )

    return question
  }
}
