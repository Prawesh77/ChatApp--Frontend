import { IUser } from "./user.interface";

export interface IChatList{
    id: number;
    createdAt: Date;
    message: string;
    receiver: IUser;
    sender: IUser;
    type: string
  }

export interface IMessage{
    sender: string,
    receiver: string,
    message: string,
    isSeen: string,
    createdAt: Date,
    chatId: number
}