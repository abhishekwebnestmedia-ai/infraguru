import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.registrationPayload = null; // keep last registration payload for reconnects
  }

  getBaseURL() {
    return 'https://backend.infraguru.in';
  }

  connect() {
    if (this.socket && this.isConnected) return this.socket;

    try {
      const baseURL = this.getBaseURL();
      this.socket = io(baseURL, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        secure: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        auth: { token: localStorage.getItem('authToken') || localStorage.getItem('token') }
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        if (this.registrationPayload) {
          try { this.socket.emit('register_user', this.registrationPayload); } catch (e) { console.warn('SocketService register emit failed', e); }
        } else {
          this.registerUser();
        }
      });

      this.socket.on('disconnect', () => { this.isConnected = false; });
      this.socket.on('connect_error', () => { this.isConnected = false; });

      return this.socket;
    } catch (err) {
      console.error('SocketService connect error', err);
      return null;
    }
  }

  registerUser() {
    if (!this.socket || !this.isConnected) return;
    let userInfo = {};
  try { userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}'); } catch { /* ignore */ }
    const userId = userInfo.id || userInfo._id || userInfo.userId || `anon_${Date.now()}`;
    const role = userInfo.role || 'admin';
    this.socket.emit('register_user', { userId, role });
  }

  registerUserWith(payload) {
    this.registrationPayload = payload || null;
    if (this.socket && this.isConnected && this.registrationPayload) {
      try { this.socket.emit('register_user', this.registrationPayload); } catch (e) { console.warn(e); }
    }
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.isConnected = false;
  }

  getSocket() { return (!this.socket || !this.isConnected) ? this.connect() : this.socket; }

  // group helpers
  joinGroup(groupId) { this.getSocket()?.emit('join_group', { groupId }); }
  leaveGroup(groupId) { this.getSocket()?.emit('leave_group', { groupId }); }
  sendBroadcast(groupId, message) { this.getSocket()?.emit('send_broadcast', { groupId, message }); }
  getGroupMessages(groupId) { this.getSocket()?.emit('get_group_messages', { groupId }); }

  // event helpers
  onBroadcastReceived(cb) { this.getSocket()?.on('broadcast_received', cb); }
  onGroupMessages(cb) { this.getSocket()?.on('group_messages', cb); }
  onJoinedGroup(cb) { this.getSocket()?.on('joined_group', cb); }
  onLeftGroup(cb) { this.getSocket()?.on('left_group', cb); }
  onBroadcastSent(cb) { this.getSocket()?.on('broadcast_sent', cb); }

  offBroadcastReceived(cb) { this.getSocket()?.off('broadcast_received', cb); }
  offGroupMessages(cb) { this.getSocket()?.off('group_messages', cb); }

  on(event, cb) { this.getSocket()?.on(event, cb); }
  off(event, cb) { this.getSocket()?.off(event, cb); }

  testConnection() {
    if (this.socket && this.isConnected) this.socket.emit('test_connection', { message: 'Frontend test', time: new Date().toISOString() });
  }
}

const socketService = new SocketService();
if (typeof window !== 'undefined') window.socketService = socketService;
export default socketService;

