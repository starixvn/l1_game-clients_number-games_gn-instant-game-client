import { io } from "socket.io-client";
import MsgpackParser from "socket.io-msgpack-parser";
import { getAppSettings } from "../app-settings";
import { buildServerUrl } from "../helpers";
import { SocketInfo } from "./../../components/game-base/type";
import { GameMessageHandler, messageEventType } from "../../components/game-base/handlers";

export function InitSocketIO(socketInfo: SocketInfo, session: any, gameName: string, gameMessageHandler: GameMessageHandler) {
    const { proxy, enableMsgpackParser } = getAppSettings();
    const socketUri = buildServerUrl(socketInfo.namespace);
    const socketOption = {
        forceNew: true,
        transports: ["websocket"],
        path: `${proxy.path}/${socketInfo.path}/socket.io`,
        upgrade: false,
        parser: enableMsgpackParser ? MsgpackParser : undefined,
        pingTimeout: 5000,
    };

    const socket = io(socketUri, socketOption);

    let lastPong = null;
    const sendPing = () => {
        const timestamp = Date.now();
        console.log(`Sending custom_ping with timestamp: ${timestamp}`);
        socket.emit("custom_ping", timestamp);


        setTimeout(() => {
            if (!lastPong || lastPong < timestamp) {
                console.warn("No pong received for the last ping!");
            }
        }, 5000);
    }

    if (socket) {
        gameMessageHandler.registerSocketEvents();

        socket.off(gameName).on(gameName, gameMessageHandler.broadcastGameEvent);
        socket.off("message").on("message", (message) => {
            gameMessageHandler.broadcastGameMessage(message);
        });

        socket.on(messageEventType.SOCKET_CONNECTED, () => {
            socket.emit("signin", session);
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SOCKET_CONNECTED]: true });
        });

        socket.on(messageEventType.SIGNED_IN, () => {
            socket.emit("inGame", gameName);
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SIGNED_IN]: true });
        });

        socket.on(messageEventType.SOCKET_CONNECT_ERROR, () => {
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SOCKET_CONNECT_ERROR]: true });
        });
        socket.on(messageEventType.SOCKET_DISCONNECTED, () => {
            gameMessageHandler.broadcastGameEvent({ [messageEventType.SOCKET_DISCONNECTED]: true });
        });

        socket.on("custom_pong", (timestamp) => {
            console.log(`%cReceived custom_pong for timestamp: ${timestamp}`, 'color: blue; font-weight: bold; background: yellow;');
            lastPong = timestamp;
        });

        socket.on('health-check', (message, callback) => {
            console.log(message);
            callback('yes');
        });

        // setInterval(sendPing, 2000);
    }

    return { socket };
}

export enum SocketState {
    None,
    Connected,
    Error,
    Disconnected,
}
