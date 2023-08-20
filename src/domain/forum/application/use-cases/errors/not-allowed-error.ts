import { UseCaseErrors } from "@/core/errors/use-case-error";

export class NotAllowedError extends Error implements UseCaseErrors {
    constructor() {
        super("Not allowed.")
    }
}