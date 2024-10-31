import { IUser } from "./user.interface";

export interface IChat{
    id: number
} 

export interface IChatList{
    id: number;
    createdAt: Date;
    message: string;
    receiver: IUser;
    sender: IUser;
    type: string;
    chat: IChat;
  }

export interface IMessage{
    sender: string,
    receiver: string,
    message: string,
    isSeen: string,
    createdAt: Date,
    chatId: number
}