import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity.id";
import { Optional } from "@/core/types/optional";

interface NotificationProps {
    receiverId: UniqueEntityID
    title: string
    content: string
    createdAt: Date
    readAt?: Date
}

export class Notification extends Entity<NotificationProps> {
    get receiverId() {
        return this.props.receiverId
    }

    get title() {
        return this.props.title
    }

    get content() {
        return this.props.content
    }

    get createdAt() {
        return this.props.createdAt
    }

    get readAt() {
        return this.props.readAt
    }

    static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityID) {
        const notification = new Notification({
            ...props,
            createdAt: props.createdAt ?? new Date()
        }, id)

        return notification
    }
}