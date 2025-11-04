// ADD THIS TO YOUR BACKEND server.js FILE
// Add these socket event handlers after your existing socket connection code

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Existing register_user handler (keep this)
  socket.on("register_user", ({ userId, role }) => {
    if (userId) {
      socket.join(userId);
      onlineUsers.set(userId, { socketId: socket.id, role });
      console.log(`👤 ${role || "user"} registered socket: ${userId}`);
    }
  });

  // NEW: Broadcast-related socket events
  socket.on("join_group", ({ groupId }) => {
    console.log(`🏘️ Socket ${socket.id} joining group: ${groupId}`);
    socket.join(groupId);
    socket.emit("joined_group", { groupId, success: true });
  });

  socket.on("leave_group", ({ groupId }) => {
    console.log(`🚪 Socket ${socket.id} leaving group: ${groupId}`);
    socket.leave(groupId);
    socket.emit("left_group", { groupId, success: true });
  });

  socket.on("send_broadcast", async ({ groupId, message }) => {
    try {
      console.log(`📤 Broadcasting to group ${groupId}:`, message);
      
      // TODO: Save to database using your broadcast model
      // Example:
      // const Broadcast = require('./models/Broadcast'); // Your broadcast model
      // const broadcast = await Broadcast.create({ 
      //   groupId, 
      //   message, 
      //   createdBy: socket.userId // You'll need to store this during register_user
      // });
      
      // For now, create a mock broadcast object
      const broadcastData = {
        id: Date.now(), // Replace with actual broadcast ID from DB
        _id: Date.now(), // Alternative ID format
        groupId,
        message,
        createdBy: { name: 'Admin' }, // Replace with actual user data
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };
      
      // Emit to all users in the group
      io.to(groupId).emit("broadcast_received", broadcastData);
      
      // Confirm to sender
      socket.emit("broadcast_sent", { success: true, broadcast: broadcastData });
      
    } catch (error) {
      console.error("❌ Error sending broadcast:", error);
      socket.emit("broadcast_error", { error: error.message });
    }
  });

  socket.on("get_group_messages", async ({ groupId }) => {
    try {
      console.log(`📥 Fetching messages for group: ${groupId}`);
      
      // TODO: Fetch from database using your broadcast model
      // Example:
      // const Broadcast = require('./models/Broadcast'); // Your broadcast model
      // const messages = await Broadcast.find({ groupId }).populate('createdBy').sort({ createdAt: -1 });
      
      // For now, send empty array - replace with actual DB query
      const messages = [];
      
      socket.emit("group_messages", {
        groupId,
        messages: messages.map(msg => ({
          id: msg._id || msg.id,
          _id: msg._id || msg.id,
          message: msg.message,
          groupId: msg.groupId,
          createdBy: msg.createdBy,
          createdAt: msg.createdAt,
          timestamp: msg.createdAt
        }))
      });
      
    } catch (error) {
      console.error("❌ Error fetching group messages:", error);
      socket.emit("group_messages_error", { error: error.message });
    }
  });

  socket.on("test_connection", (data) => {
    console.log("🧪 Test connection received:", data);
    socket.emit("test_response", { 
      message: "Backend received your test!", 
      timestamp: new Date().toISOString(),
      socketId: socket.id 
    });
  });

  // Existing disconnect handler (keep this)
  socket.on("disconnect", () => {
    for (let [uid, info] of onlineUsers.entries()) {
      if (info.socketId === socket.id) {
        onlineUsers.delete(uid);
        console.log(`🔴 User disconnected: ${uid}`);
        break;
      }
    }
  });
});

// ALSO UPDATE YOUR CORS CONFIGURATION:
// Replace your existing CORS config with this:

app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3002"], // Add your frontend port
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// And update Socket.IO CORS:
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002"], // Add your frontend port
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});