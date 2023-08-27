import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { CommentOnAnswerUseCase } from "./comment-on-answer"
import { makeAnswer } from "test/factories/make-answer"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"

describe("Comment on Answer", () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let commentOnAnswer: CommentOnAnswerUseCase
  let inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    commentOnAnswer = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    )
  })

  test("it should be able to comment on a answer", async() => {
    await inMemoryAnswersRepository.create(makeAnswer({}, new UniqueEntityID("answer-01")))

    const result = await commentOnAnswer.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "Test comment"
    })

    expect(result.isRight()).toBe(true)
  })

  test("it should not be able to comment on a nonexistent answer", async() => {
    const result = await commentOnAnswer.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "Test comment"
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})