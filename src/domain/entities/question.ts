import { randomUUID } from "crypto"

export class Question {
  public id: string
  public title: string
  public content: string

  constructor(content: string, title: string, id?: string) {
    this.id = id ?? randomUUID()
    this.title = title
    this.content = content
  }
}