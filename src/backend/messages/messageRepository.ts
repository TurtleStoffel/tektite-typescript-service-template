import { mkdirSync } from "node:fs";
import path from "node:path";
import PouchDB from "pouchdb";
import type { StoredMessage } from "@/shared/messages";

type MessageDocument = {
    _id: string;
    createdAt: string;
    text: string;
    type: "message";
};

const databasePath = path.join(process.cwd(), "data", "messages");

mkdirSync(path.dirname(databasePath), { recursive: true });

const database = new PouchDB<MessageDocument>(databasePath);

export class MessageRepository {
    async create(message: StoredMessage): Promise<void> {
        await database.put({
            _id: message.id,
            createdAt: message.createdAt,
            text: message.text,
            type: "message",
        });
    }

    async list(): Promise<StoredMessage[]> {
        const result = await database.allDocs({
            descending: true,
            include_docs: true,
        });

        return result.rows.flatMap((row) => {
            const document = row.doc;

            if (document === undefined || document.type !== "message") {
                return [];
            }

            return [
                {
                    createdAt: document.createdAt,
                    id: document._id,
                    text: document.text,
                },
            ];
        });
    }
}
