import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachment } from './question-attachment'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachment[]
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
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

  set attachments(attachments: QuestionAttachment[]) {
    this.props.attachments = attachments
  }

  get attachments() {
    return this.props.attachments
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
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createSlugFromText(props.title),
        attachments: props.attachments ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
