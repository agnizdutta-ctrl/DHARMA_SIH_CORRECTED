import { GameRoom } from '../engine/gameState';

export class RoomManager {
  private rooms: Map<string, GameRoom> = new Map();
  private socketToRoom: Map<string, { roomId: string; playerId: string }> = new Map();

  createRoom(roomId: string, maxRounds: number = 7): GameRoom {
    const room = new GameRoom(roomId, maxRounds);
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  getRoomBySocket(socketId: string): { room: GameRoom; playerId: string } | undefined {
    const mapping = this.socketToRoom.get(socketId);
    if (!mapping) return undefined;
    const room = this.rooms.get(mapping.roomId);
    if (!room) return undefined;
    return { room, playerId: mapping.playerId };
  }

  mapSocket(socketId: string, roomId: string, playerId: string): void {
    this.socketToRoom.set(socketId, { roomId, playerId });
  }

  unmapSocket(socketId: string): void {
    this.socketToRoom.delete(socketId);
  }

  deleteRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      for (const p of room.players) {
        if (p.socketId) {
          this.socketToRoom.delete(p.socketId);
        }
      }
      this.rooms.delete(roomId);
    }
  }

  getAllRoomsCount(): number {
    return this.rooms.size;
  }
}

export const roomManager = new RoomManager();
