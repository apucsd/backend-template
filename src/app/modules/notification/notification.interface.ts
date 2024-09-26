import { Types } from 'mongoose';

export type TNotification = {
    recipient: Types.ObjectId;
    message: string;
    read: boolean;
    role: 'USER' | 'ADMIN' | 'SUPER-ADMIN';
    type: string;
};
