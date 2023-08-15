import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { CommentOnQuestionUseCase } from "./comment-on-question"
import { makeQuestion } from "test/factories/make-question"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"

describe("Comment on Question", () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let commentOnQuestion: CommentOnQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    commentOnQuestion = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository
    )
  })

  test("it should be able to comment on a question", async() => {
    await inMemoryQuestionsRepository.create(makeQuestion({}, new UniqueEntityID("question-01")))

    const { questionComment } = await commentOnQuestion.execute({
      authorId: "author-01",
      content: "Test comment",
      questionId: "question-01"
    })

    expect(questionComment.id).toBeTruthy()
    expect(inMemoryQuestionCommentsRepository.comments).toHaveLength(1)
  })

  test("it should not be able to create a comment on a nonexistent question", async() => {
    expect(async() => {
      await commentOnQuestion.execute({
        authorId: "author-01",
        content: "Test comment",
        questionId: "question-01"
      })
    }).rejects.toBeInstanceOf(Error)
  })
})