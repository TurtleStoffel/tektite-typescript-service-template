import { randomUUID } from "node:crypto";
import { Result } from "typescript-result";
import {
    type CreateMessageInput,
    createMessageInputSchema,
    type StoredMessage,
} from "@/shared/messages";
import type { MessageRepository } from "./messageRepository";

type MessageValidationError = {
    message: string;
    type: "message-validation-error";
};

export class MessageService {
    constructor(private readonly repository: MessageRepository) {}

    validateCreateMessageInput(
        input: CreateMessageInput,
    ): Result<CreateMessageInput, MessageValidationError> {
        const parsedInput = createMessageInputSchema.safeParse(input);

        if (!parsedInput.success) {
            return Result.error({
                message: parsedInput.error.issues[0]?.message ?? "Invalid message payload",
                type: "message-validation-error",
            });
        }

        return Result.ok(parsedInput.data);
    }

    async createMessage(input: CreateMessageInput): Promise<StoredMessage> {
        const [parsedInput, validationError] = this.validateCreateMessageInput(input).toTuple();

        if (validationError !== null) {
            throw new Error(validationError.message);
        }

        const message: StoredMessage = {
            createdAt: new Date().toISOString(),
            id: randomUUID(),
            text: parsedInput.text,
        };

        console.log("Creating message", { id: message.id, createdAt: message.createdAt });
        await this.repository.create(message);
        return message;
    }

    async listMessages(): Promise<StoredMessage[]> {
        console.log("Listing stored messages");
        return this.repository.list();
    }
}
