import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { createMessage, listMessages } from "./messageApi";

export function App() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur">
                <div className="mb-8 space-y-3">
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                        PouchDB-backed messages
                    </p>
                    <h1 className="text-4xl font-semibold text-white">
                        Store simple frontend messages in the backend
                    </h1>
                    <p className="max-w-2xl text-sm leading-6 text-slate-300">
                        Submit a message from the browser and the Bun backend will persist it with
                        PouchDB, then reload the stored history.
                    </p>
                </div>

                <nav className="mb-8 flex gap-3">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            [
                                "rounded-full px-4 py-2 text-sm transition",
                                isActive
                                    ? "bg-cyan-300 text-slate-950"
                                    : "border border-white/10 bg-slate-900/70 text-slate-200",
                            ].join(" ")
                        }
                    >
                        Messages
                    </NavLink>
                    <NavLink
                        to="/status"
                        className={({ isActive }) =>
                            [
                                "rounded-full px-4 py-2 text-sm transition",
                                isActive
                                    ? "bg-cyan-300 text-slate-950"
                                    : "border border-white/10 bg-slate-900/70 text-slate-200",
                            ].join(" ")
                        }
                    >
                        Status
                    </NavLink>
                </nav>

                <Routes>
                    <Route path="/" element={<MessagesPage />} />
                    <Route path="/status" element={<StatusPage />} />
                </Routes>
            </section>
        </main>
    );
}

function MessagesPage() {
    const [draftMessage, setDraftMessage] = useState("");
    const queryClient = useQueryClient();
    const messagesQuery = useQuery({
        queryFn: listMessages,
        queryKey: ["messages"],
    });
    const createMessageMutation = useMutation({
        mutationFn: createMessage,
        onSuccess: async () => {
            setDraftMessage("");
            await queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
    });

    return (
        <>
            <form
                className="mb-8 flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    createMessageMutation.mutate({ text: draftMessage });
                }}
            >
                <label className="text-sm font-medium text-slate-200" htmlFor="message-input">
                    Message
                </label>
                <textarea
                    id="message-input"
                    name="message"
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.currentTarget.value)}
                    placeholder="Write something worth saving"
                    className="min-h-32 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                    maxLength={500}
                />
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                        {draftMessage.trim().length}/500 characters
                    </p>
                    <button
                        type="submit"
                        className="rounded-full bg-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                        disabled={
                            createMessageMutation.isPending || draftMessage.trim().length === 0
                        }
                    >
                        {createMessageMutation.isPending ? "Saving..." : "Save message"}
                    </button>
                </div>
                {createMessageMutation.isError ? (
                    <p className="text-sm text-rose-300">{createMessageMutation.error.message}</p>
                ) : null}
            </form>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-white">Stored messages</h2>
                    {messagesQuery.isFetching ? (
                        <span className="text-xs text-slate-400">Refreshing…</span>
                    ) : null}
                </div>

                {messagesQuery.isLoading ? (
                    <p className="text-sm text-slate-300">Loading messages…</p>
                ) : null}
                {messagesQuery.isError ? (
                    <p className="text-sm text-rose-300">{messagesQuery.error.message}</p>
                ) : null}

                {messagesQuery.data?.messages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">
                        No messages stored yet.
                    </div>
                ) : null}

                <ul className="space-y-3">
                    {messagesQuery.data?.messages.map((message) => (
                        <li
                            key={message.id}
                            className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                        >
                            <p className="mb-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">
                                {message.text}
                            </p>
                            <p className="text-xs text-slate-400">
                                {new Date(message.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

function StatusPage() {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-cyan-300">Router status</p>
            <p className="text-sm leading-6 text-slate-300">
                React Router is mounted and handling client-side navigation for this small two-page
                interface.
            </p>
        </div>
    );
}
