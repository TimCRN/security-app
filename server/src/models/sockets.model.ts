import mongoose from 'mongoose';

export interface ISocketMapping {
  userId: string;
  socketId: string;
}

const socketSchema = new mongoose.Schema<ISocketMapping>(
  {
    userId: {type: String, required: true},
    socketId: {type: String, required: true},
  },
  {
    collection: 'sockets',
    timestamps: true,
  }
);

export const Sockets = mongoose.model<ISocketMapping>('Socket', socketSchema);
