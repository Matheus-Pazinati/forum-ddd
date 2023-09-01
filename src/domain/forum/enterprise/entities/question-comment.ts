import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CommentProps, Comment } from './comment'
import { QuestionCommentCreatedEvents } from '../events/question-comment-created-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    if (isNewQuestionComment) {
      questionComment.addDomainEvent(new QuestionCommentCreatedEvents(questionComment))
    }

    return questionComment
  }
}
