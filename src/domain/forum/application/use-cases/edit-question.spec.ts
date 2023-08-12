import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { EditQuestionUseCase } from "./edit-question"
import { makeQuestion } from "test/factories/make-question"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"

describe("Edit Question Title or Content", () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let editQuestion: EditQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    editQuestion = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  test("it should be able to edit a question", async() => {
    const question = makeQuestion({
      title: "Old title",
      content: "Old title",
      authorId: new UniqueEntityID("author-01"),
    }, new UniqueEntityID("question-01"))

    inMemoryQuestionsRepository.create(question)

    await editQuestion.execute({
      authorId: "author-01",
      questionId: "question-01",
      content: "New content",
      title: "New title"
    })

    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      content: "New content",
      title: "New title"
    })
  })
})