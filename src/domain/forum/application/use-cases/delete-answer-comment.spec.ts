import { describe } from "node:test";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { ResourceNotFoundError } from "@/core/errors/use-case-errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/use-case-errors/not-allowed-error";

describe("Delete a Answer Comment", () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let deleteAnswerComment: DeleteAnswerCommentUseCase

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    deleteAnswerComment = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  test("it should be able to delete a answer comment", async() => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await deleteAnswerComment.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString()
    })

    expect(inMemoryAnswerCommentsRepository.comments).toHaveLength(0)
  })

  test("it should not be able to delete a nonexistent answer comment", async() => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await deleteAnswerComment.execute({
      answerCommentId: "Nonexistent comment",
      authorId: answerComment.authorId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  test("it should not be able to delete a answer comment from another author", async() => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await deleteAnswerComment.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: "Another user"
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})