import type { Socket } from "socket.io";

export const handleSocketError = (socket: Socket, error: unknown) => {
  console.error("[Socket.IO Internal Error]:", error);

  if (error instanceof Error) {
    const code =
      "code" in error
        ? (error as Record<string, unknown>).code
        : "INTERNAL_ERROR";

    socket.emit("error", {
      code: typeof code === "string" ? code : "INTERNAL_ERROR",
      message: error.message,
    });
    return;
  }

  socket.emit("error", {
    code: "INTERNAL_ERROR",
    message: "Something went wrong",
  });
};
