import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { DeleteQuestionCommentUseCase } from "./delete-question-comment"
import { makeQuestionComment } from "test/factories/make-question-comment"
import { ResourceNotFoundError } from "@/core/errors/use-case-errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/use-case-errors/not-allowed-error"

describe("Delete Question Comment", () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let deleteQuestionComment: DeleteQuestionCommentUseCase

  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    deleteQuestionComment = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  test("it should be able to delete a question comment", async() => {
    const questionComment = makeQuestionComment()

    inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await deleteQuestionComment.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionCommentsRepository.comments).toHaveLength(0)
  })

  test("it should not be able to delete a nonexistent question comment", async() => {
    const questionComment = makeQuestionComment()

    inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await deleteQuestionComment.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: "Nonexistent id"
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  test("it should not be able to delete a question comment made by other author", async() => {
    const questionComment = makeQuestionComment()

    inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await deleteQuestionComment.execute({
      authorId: "Other user",
      questionCommentId: questionComment.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})