import { createMessageInputSchema, listMessagesResponseSchema } from "@/shared/messages";
import { MessageRepository } from "./messageRepository";
import { MessageService } from "./messageService";

const messageService = new MessageService(new MessageRepository());

export const messageRoutes = {
    "/api/messages": {
        async GET() {
            const messages = await messageService.listMessages();
            return Response.json(listMessagesResponseSchema.parse({ messages }));
        },
        async POST(request: Request) {
            const body = createMessageInputSchema.parse(await request.json());
            const [validatedInput, validationError] = messageService
                .validateCreateMessageInput(body)
                .toTuple();

            if (validationError !== null) {
                return Response.json(
                    {
                        error: validationError.message,
                    },
                    { status: 400 },
                );
            }

            const message = await messageService.createMessage(validatedInput);
            return Response.json(message, { status: 201 });
        },
    },
};
