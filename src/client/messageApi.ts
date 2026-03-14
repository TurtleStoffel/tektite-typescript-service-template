import {
    type CreateMessageInput,
    createMessageInputSchema,
    type ListMessagesResponse,
    listMessagesResponseSchema,
    type StoredMessage,
    storedMessageSchema,
} from "@/shared/messages";

export async function listMessages(): Promise<ListMessagesResponse> {
    const response = await fetch("/api/messages");

    if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.status}`);
    }

    return listMessagesResponseSchema.parse(await response.json());
}

export async function createMessage(input: CreateMessageInput): Promise<StoredMessage> {
    const payload = createMessageInputSchema.parse(input);
    const response = await fetch("/api/messages", {
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });

    if (!response.ok) {
        throw new Error(`Failed to create message: ${response.status}`);
    }

    return storedMessageSchema.parse(await response.json());
}
