import { model, Schema } from 'mongoose';
import { TNotification } from './notification.interface';

const NotificationSchema = new Schema<TNotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN', 'SUPER-ADMIN'],
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Notification = model<TNotification>('notification', NotificationSchema);
