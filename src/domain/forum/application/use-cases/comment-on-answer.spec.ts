import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { CommentOnAnswerUseCase } from "./comment-on-answer"
import { makeAnswer } from "test/factories/make-answer"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"

describe("Comment on Answer", () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let commentOnAnswer: CommentOnAnswerUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    commentOnAnswer = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    )
  })

  test("it should be able to comment on a answer", async() => {
    await inMemoryAnswersRepository.create(makeAnswer({}, new UniqueEntityID("answer-01")))

    const { answerComment } = await commentOnAnswer.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "Test comment"
    })

    expect(answerComment.id).toBeTruthy()
  })

  test("it should not be able to comment on a nonexistent answer", async() => {
    expect(async() => {
      await commentOnAnswer.execute({
        answerId: "answer-01",
        authorId: "author-01",
        content: "Test comment"
      })
    }).rejects.toBeInstanceOf(Error)
  })
})