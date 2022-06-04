export enum SOCKET_EVENT {
    /**
     * handle user request joining a chatroom
     */
    REQUEST_JOIN_ROOM = 'request_join_room',
    RESPONSE_JOIN_ROOM = 'response_join_room',

    /**
     * handle user action after joining a chatroom
     */
    JOIN_ROOM = 'join_room',
    MESSAGE = 'message',
    CONNECTION_STATUS = 'connection_status',
    USER_TYPING = 'user_typing',
}
