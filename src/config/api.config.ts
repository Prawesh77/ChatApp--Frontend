export class API {
    static HOST = import.meta.env.VITE_HOST;
    static LOGIN = '/login';
    static GET_CHAT_LIST = '/chat/get-chat-list';
    static SEEN_STATUS = '/chat/seen-status';
    static SEND_MESSAGE = '/chat/send-message';
    static GET_MESSAGE = '/chat/get-message';
}