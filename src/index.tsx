import { serve } from "bun";
import { messageRoutes } from "./backend/messages/messageRoutes";
import index from "./index.html";

const server = serve({
    routes: {
        ...messageRoutes,
        "/*": index,
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log("Server running", { url: server.url.toString() });
