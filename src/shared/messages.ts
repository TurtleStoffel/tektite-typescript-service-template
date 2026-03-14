import { z } from "zod";

const messageTextSchema = z.string().trim().min(1).max(500);

export const createMessageInputSchema = z.object({
    text: messageTextSchema,
});

export const storedMessageSchema = z.object({
    id: z.string(),
    text: messageTextSchema,
    createdAt: z.string().datetime(),
});

export const listMessagesResponseSchema = z.object({
    messages: z.array(storedMessageSchema),
});

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;
export type ListMessagesResponse = z.infer<typeof listMessagesResponseSchema>;
export type StoredMessage = z.infer<typeof storedMessageSchema>;
