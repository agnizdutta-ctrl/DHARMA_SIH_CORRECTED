import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import cardsData from './data/cards.json';
import { roomManager } from './server/roomManager';

const PORT = 3000;
const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Dharma: Mughalyugam',
    activeRooms: roomManager.getAllRoomsCount()
  });
});

app.get('/api/cards', (req, res) => {
  res.json(cardsData);
});

// Socket.IO handling
io.on('connection', (socket) => {
  socket.on('room:create', ({ roomId, maxRounds, playerName, p2Name, againstAI }) => {
    const rId = roomId || `court_${Math.random().toString(36).substr(2, 6)}`;
    let room = roomManager.getRoom(rId);
    if (!room) {
      room = roomManager.createRoom(rId, maxRounds || 7);
    }

    const p1Id = `p1_${socket.id.substr(0, 6)}`;
    const p1 = room.addPlayer(p1Id, socket.id, playerName || 'Mirza Raja Jai Singh');
    roomManager.mapSocket(socket.id, rId, p1Id);
    socket.join(rId);

    // If second player provided or against AI
    if (p2Name || againstAI) {
      const p2Id = againstAI ? `bot_${Math.random().toString(36).substr(2, 6)}` : `p2_${Date.now()}`;
      room.addPlayer(
        p2Id,
        againstAI ? 'bot_socket' : '',
        p2Name || (againstAI ? 'Princess Jahanara (AI)' : 'Princess Jahanara')
      );
    }

    socket.emit('room:created', {
      roomId: rId,
      playerId: p1.id,
      state: room.getSnapshot(p1.id)
    });

    io.to(rId).emit('game:sync', room.getSnapshot());
  });

  socket.on('room:join', ({ roomId, playerName }) => {
    const room = roomManager.getRoom(roomId);
    if (!room) {
      socket.emit('error', { message: 'Court room not found' });
      return;
    }

    const playerId = `p_${socket.id.substr(0, 6)}`;
    const player = room.addPlayer(playerId, socket.id, playerName || 'Chronicler');
    roomManager.mapSocket(socket.id, roomId, playerId);
    socket.join(roomId);

    socket.emit('room:joined', {
      roomId,
      playerId: player.id,
      state: room.getSnapshot(player.id)
    });

    io.to(roomId).emit('game:sync', room.getSnapshot());
  });

  socket.on('room:start', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return;

    if (room.players.length < 2) {
      // Auto-add Court AI Chronicler
      room.addPlayer(`bot_${Date.now()}`, 'bot_socket', 'Princess Jahanara (Court AI)');
    }

    room.dealCards();

    // Broadcast individual hands to respective sockets
    for (const player of room.players) {
      if (player.socketId && player.socketId !== 'bot_socket') {
        io.to(player.socketId).emit('game:sync', room.getSnapshot(player.id));
      }
    }
    io.to(roomId).emit('game:started', room.getSnapshot());
  });

  socket.on('game:playCard', ({ roomId, cardId, targetNodeId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return;

    const mapping = roomManager.getRoomBySocket(socket.id);
    const playerId = mapping ? mapping.playerId : room.getCurrentPlayer().id;

    const result = room.playCard(playerId, cardId, targetNodeId);
    if (!result.success) {
      socket.emit('game:playError', { message: result.message });
      return;
    }

    // Sync personalized states
    for (const player of room.players) {
      if (player.socketId && player.socketId !== 'bot_socket') {
        io.to(player.socketId).emit('game:sync', room.getSnapshot(player.id));
      }
    }
    io.to(roomId).emit('game:cardPlayed', {
      result,
      state: room.getSnapshot()
    });

    // Check if next turn belongs to a bot
    handleBotTurn(room, roomId);
  });

  socket.on('game:drawCard', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return;

    const mapping = roomManager.getRoomBySocket(socket.id);
    const playerId = mapping ? mapping.playerId : room.getCurrentPlayer().id;

    const result = room.drawCard(playerId);

    for (const player of room.players) {
      if (player.socketId && player.socketId !== 'bot_socket') {
        io.to(player.socketId).emit('game:sync', room.getSnapshot(player.id));
      }
    }
    io.to(roomId).emit('game:cardDrawn', {
      result,
      state: room.getSnapshot()
    });

    handleBotTurn(room, roomId);
  });

  socket.on('game:timeout', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || room.gameStatus !== 'active') return;
    const currentP = room.getCurrentPlayer();
    room.drawCard(currentP.id);
    for (const player of room.players) {
      if (player.socketId && player.socketId !== 'bot_socket') {
        io.to(player.socketId).emit('game:sync', room.getSnapshot(player.id));
      }
    }
    io.to(roomId).emit('game:sync', room.getSnapshot());
    handleBotTurn(room, roomId);
  });

  socket.on('disconnect', () => {
    const mapping = roomManager.getRoomBySocket(socket.id);
    if (mapping) {
      const { room, playerId } = mapping;
      const player = room.players.find((p) => p.id === playerId);
      if (player) {
        player.isConnected = false;
        // 60-second reconnect window
        player.disconnectTimeout = setTimeout(() => {
          if (!player.isConnected && room.gameStatus === 'active') {
            room.logAction({
              actionType: 'play',
              playerId: player.id,
              playerName: player.name,
              cardName: 'Forfeit',
              category: 'Disconnection',
              points: 0,
              message: `${player.name} failed to reconnect in 60s and forfeited the match.`
            });
            room.endGame();
            io.to(room.id).emit('game:sync', room.getSnapshot());
          }
        }, 60000);
      }
      io.to(room.id).emit('game:sync', room.getSnapshot());
    }
  });
});

// Helper for automated AI bot turns
function handleBotTurn(room: any, roomId: string) {
  if (room.gameStatus !== 'active') return;
  const currentP = room.getCurrentPlayer();
  if (!currentP || (!currentP.socketId?.startsWith('bot') && currentP.id.indexOf('bot') === -1)) {
    return;
  }

  // Artificial thinking delay (1200ms) for realistic experience
  setTimeout(() => {
    if (room.gameStatus !== 'active') return;
    if (room.getCurrentPlayer().id !== currentP.id) return;

    // Search for a legal move in bot's hand
    let played = false;
    for (const card of currentP.hand) {
      const legalTargets = room.engine.getLegalTargets(card, room.chain);
      if (legalTargets.length > 0) {
        // Pick best target
        const target = legalTargets[legalTargets.length - 1];
        const res = room.playCard(currentP.id, card.id, target.id);
        if (res.success) {
          played = true;
          for (const player of room.players) {
            if (player.socketId && player.socketId !== 'bot_socket') {
              io.to(player.socketId).emit('game:sync', room.getSnapshot(player.id));
            }
          }
          io.to(roomId).emit('game:cardPlayed', {
            result: res,
            state: room.getSnapshot()
          });
          break;
        }
      }
    }

    // If no legal card in hand, bot must draw
    if (!played) {
      const drawRes = room.drawCard(currentP.id);
      for (const player of room.players) {
        if (player.socketId && player.socketId !== 'bot_socket') {
          io.to(player.socketId).emit('game:sync', room.getSnapshot(player.id));
        }
      }
      io.to(roomId).emit('game:cardDrawn', {
        result: drawRes,
        state: room.getSnapshot()
      });
    }

    // If another bot is next, recursively trigger
    handleBotTurn(room, roomId);
  }, 1200);
}

// Vite middleware for development vs static build in production
async function start() {
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Dharma: Mughalyugam server running on http://0.0.0.0:${PORT}`);
  });
}

start();
