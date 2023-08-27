import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { CommentOnQuestionUseCase } from "./comment-on-question"
import { makeQuestion } from "test/factories/make-question"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"

describe("Comment on Question", () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let commentOnQuestion: CommentOnQuestionUseCase
  let inMemoryQuestionAttachmentsRepository : InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    commentOnQuestion = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository
    )
  })

  test("it should be able to comment on a question", async() => {
    await inMemoryQuestionsRepository.create(makeQuestion({}, new UniqueEntityID("question-01")))

    const result = await commentOnQuestion.execute({
      authorId: "author-01",
      content: "Test comment",
      questionId: "question-01"
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryQuestionCommentsRepository.comments[0]).toEqual(result.value.questionComment)
    }
   
  })

  test("it should not be able to create a comment on a nonexistent question", async() => {
    const result = await commentOnQuestion.execute({
      authorId: "author-01",
      content: "Test comment",
      questionId: "question-01"
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})