import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    try {
      // Get the base URL - your backend runs on port 5001
      const baseURL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001'  // Updated to match your backend port
        : `${window.location.protocol}//${window.location.hostname}:5001`;

      console.log('🔌 SocketService: Connecting to:', baseURL);

      this.socket = io(baseURL, {
        autoConnect: true,
        transports: ['websocket', 'polling'],
        auth: {
          token: localStorage.getItem('authToken') || localStorage.getItem('token')
        }
      });

      this.socket.on('connect', () => {
        console.log('✅ SocketService: Connected with ID:', this.socket.id);
        this.isConnected = true;
        
        // Register user with backend as required
        this.registerUser();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ SocketService: Disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ SocketService: Connection error:', error);
        this.isConnected = false;
      });

      // Listen for test responses
      this.socket.on('test_response', (data) => {
        console.log('🧪 SocketService: Test response from backend:', data);
      });

      return this.socket;
    } catch (error) {
      console.error('❌ SocketService: Failed to create socket connection:', error);
      return null;
    }
  }

  // Register user with backend (required by your backend)
  registerUser() {
    if (this.socket && this.isConnected) {
      // Get user info from localStorage
      let userInfo = {};
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      } catch (err) {
        console.warn('Could not parse userInfo from localStorage:', err.message);
      }
      
      const userId = userInfo.id || userInfo._id || userInfo.userId || 'admin_' + Date.now();
      const role = userInfo.role || 'admin';
      
      console.log('👤 SocketService: Registering user:', { userId, role });
      this.socket.emit('register_user', { userId, role });
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 SocketService: Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    if (!this.socket || !this.isConnected) {
      return this.connect();
    }
    return this.socket;
  }

  // Broadcast related methods - updated to match your backend events
  joinGroup(groupId) {
    const socket = this.getSocket();
    if (socket) {
      console.log('👥 SocketService: Joining group:', groupId);
      socket.emit('join_group', { groupId });
    }
  }

  leaveGroup(groupId) {
    const socket = this.getSocket();
    if (socket) {
      console.log('👥 SocketService: Leaving group:', groupId);
      socket.emit('leave_group', { groupId });
    }
  }

  sendBroadcast(groupId, message) {
    const socket = this.getSocket();
    if (socket) {
      console.log('📤 SocketService: Sending broadcast:', { groupId, message });
      socket.emit('send_broadcast', { groupId, message });
    }
  }

  // Get group messages
  getGroupMessages(groupId) {
    const socket = this.getSocket();
    if (socket) {
      console.log('📥 SocketService: Requesting group messages for:', groupId);
      socket.emit('get_group_messages', { groupId });
    }
  }

  // Event listeners - updated to match your backend events
  onBroadcastReceived(callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.on('broadcast_received', callback);
    }
  }

  onGroupMessages(callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.on('group_messages', callback);
    }
  }

  onJoinedGroup(callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.on('joined_group', callback);
    }
  }

  onLeftGroup(callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.on('left_group', callback);
    }
  }

  onBroadcastSent(callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.on('broadcast_sent', callback);
    }
  }

  // Remove event listeners
  offBroadcastReceived(callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.off('broadcast_received', callback);
    }
  }

  offGroupMessages(callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.off('group_messages', callback);
    }
  }

  // Test connection
  testConnection() {
    console.log('🧪 SocketService: Testing connection...');
    console.log('Socket exists:', !!this.socket);
    console.log('Connected:', this.isConnected);
    console.log('Socket ID:', this.socket?.id);
    
    if (this.socket && this.isConnected) {
      this.socket.emit('test_connection', { message: 'Test from frontend', timestamp: new Date().toISOString() });
    } else {
      console.log('❌ Socket not connected - cannot send test');
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  window.socketService = socketService;
}

export default socketService;