import { IUser } from "./user.interface";

export interface IChat {
  id: number;
}

export interface IChatList {
  createdAt: Date;
  message: string;
  receiver: IUser;
  sender: IUser;
  type: string;
  chat: IChat;
  isSeen: boolean;
}

export interface IMessage {
  id?: number;
  createdAt: string;
  isSeen?: boolean;
  message: string;
  type: "sent" | "received";
}
