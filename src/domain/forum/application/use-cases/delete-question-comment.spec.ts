import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { DeleteQuestionCommentUseCase } from "./delete-question-comment"
import { makeQuestionComment } from "test/factories/make-question-comment"

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

    await deleteQuestionComment.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString()
    })

    expect(inMemoryQuestionCommentsRepository.comments).toHaveLength(0)
  })

  test("it should not be able to delete a nonexistent question comment", async() => {
    const questionComment = makeQuestionComment()

    inMemoryQuestionCommentsRepository.create(questionComment)

    expect(async() => {
      await deleteQuestionComment.execute({
        authorId: questionComment.authorId.toString(),
        questionCommentId: "Nonexistent id"
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test("it should not be able to delete a question comment made by other author", async() => {
    const questionComment = makeQuestionComment()

    inMemoryQuestionCommentsRepository.create(questionComment)

    expect(async() => {
      await deleteQuestionComment.execute({
        authorId: "Other user",
        questionCommentId: questionComment.id.toString()
      })
    }).rejects.toBeInstanceOf(Error)
  })
})