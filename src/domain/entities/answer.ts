import { Entity } from "../../core/entities/entity"
import { UniqueEntityID } from "../../core/entities/unique-entity.id"
import { Optional } from "../../core/types/optional"

interface AnswerProps {
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerption() {
    return this.props.content.
    substring(0, 120)
    .trimEnd()
    .concat('...')
  }

  private touch() {
    return this.props.updatedAt = new Date()
  }

  set content(newContent: string) {
    this.props.content = newContent
    this.touch()
  }

  static create(props: Optional<AnswerProps, 'createdAt'>, id?: UniqueEntityID) {
    const anwswer = new Answer({
      ...props,
      createdAt: new Date()
    }, id)

    return anwswer
  }
}