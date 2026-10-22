import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.registrationPayload = null; // keep last registration payload for reconnects
    // notifications
    this.notificationsSubscribed = false; // track if client asked for notifications
    this._pendingNotificationSubscribe = false; // flag set before connect completes
    this.lastUserId = null; // remember the last resolved user id
    // Disable real socket connections by default while debugging connectivity issues.
    // Set this to false to enable socket.io behavior again.
    this.disabled = true;
  }

  extractUserId(input) {
    if (input === undefined || input === null) return null;
    if (typeof input === 'string') return input.trim();
    if (typeof input === 'object') {
      const candidate = input.userId || input._id || input.id || input.uid || input.email || input.phone;
      return candidate ? String(candidate) : null;
    }
    return null;
  }

  getBaseURL() {
    return 'https://infragurubackend.onrender.com';
  }

  connect() {
    // If sockets are disabled, provide a safe no-op mock to avoid runtime errors
    // while keeping the same API surface for callers.
    if (this.disabled) {
      if (this.socket) return this.socket;
      const mock = {
        on: () => {},
        off: () => {},
        emit: () => {},
        disconnect: () => {},
      };
      this.socket = mock;
      this.isConnected = false;
      return this.socket;
    }

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
          try {
            const payload = this.registrationPayload;
            const toSend = this.extractUserId(payload);
            if (toSend) {
              this.lastUserId = toSend;
              this.socket.emit('register_user', toSend);
            } else {
              console.warn('SocketService: unable to resolve user id from cached payload on connect', payload);
            }
          } catch (e) { console.warn('SocketService register emit failed', e); }
        } else {
          this.registerUser();
        }
        // After (re)registration, if notifications were previously subscribed, resubscribe.
        if (this._pendingNotificationSubscribe || this.notificationsSubscribed) {
          const subscribeId = this.lastUserId || this.extractUserId(this.registrationPayload);
          this.subscribeNotifications(subscribeId ? { userId: subscribeId } : undefined);
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
    const userId = this.extractUserId(userInfo) || this.extractUserId(this.registrationPayload);
    if (!userId) {
      // Wait until registerUserWith is called with a concrete id
      console.debug('SocketService: registerUser skipped — no persisted user id yet');
      return;
    }
    // Backend expects a plain string userId for register_user
    this.lastUserId = userId;
    this.socket.emit('register_user', userId);
    // If caller requested notifications before connect completed, subscribe now.
    if (this._pendingNotificationSubscribe && !this.notificationsSubscribed) {
      this.subscribeNotifications({ userId });
    }
  }

  registerUserWith(payload) {
    this.registrationPayload = payload || null;
    const toSend = this.extractUserId(payload);
    if (toSend) {
      this.lastUserId = toSend;
    }
    if (this.socket && this.isConnected && toSend) {
      try { this.socket.emit('register_user', toSend); } catch (e) { console.warn(e); }
    } else if (!toSend) {
      console.warn('SocketService: registerUserWith called without resolvable userId', payload);
    }
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.isConnected = false;
    this._pendingNotificationSubscribe = false;
  }

  getSocket() { return (!this.socket || !this.isConnected) ? this.connect() : this.socket; }

  // group helpers
  joinGroup(groupId) { this.getSocket()?.emit('join_group', { groupId }); }
  leaveGroup(groupId) { this.getSocket()?.emit('leave_group', { groupId }); }
  sendBroadcast(groupId, message) { this.getSocket()?.emit('send_broadcast', { groupId, message }); }
  getGroupMessages(groupId) { this.getSocket()?.emit('get_group_messages', { groupId }); }

  // ------------------------------
  // Notification helpers
  // ------------------------------
  /**
   * Subscribe to user-specific notifications stream.
   * Backend should listen for 'subscribe_notifications' and bind this socket to the user's notification feed.
   */
  subscribeNotifications(payload = {}) {
    const sock = this.getSocket();
    const providedId = this.extractUserId(payload?.userId ?? payload);
    if (providedId) {
      this.lastUserId = providedId;
    }
    if (!sock || !this.isConnected) {
      // mark intent; will run post-connect/registration
      this._pendingNotificationSubscribe = true;
      return;
    }
    let userInfo = {};
    try { userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}'); } catch { /* ignore */ }
    const userId = this.lastUserId || this.extractUserId(payload?.userId ?? payload) || this.extractUserId(this.registrationPayload) || this.extractUserId(userInfo);
    if (!userId) {
      console.warn('SocketService: subscribeNotifications skipped — no userId');
      this._pendingNotificationSubscribe = true;
      return;
    }
    const extra = (payload && typeof payload === 'object' && !Array.isArray(payload)) ? { ...payload } : {};
    delete extra.userId;
    sock.emit('subscribe_notifications', { userId, ...extra });
    this.lastUserId = userId;
    this.notificationsSubscribed = true;
    this._pendingNotificationSubscribe = false;
  }

  /** Request latest notifications list */
  getNotifications(options = {}) { this.getSocket()?.emit('get_notifications', options); }

  /** Mark a single notification as read */
  markNotificationRead(notificationId) { this.getSocket()?.emit('mark_notification_read', { notificationId }); }

  /** Mark all notifications as read */
  markAllNotificationsRead() { this.getSocket()?.emit('mark_all_notifications_read'); }

  // Notification event listeners
  onNotification(cb) {
    // Attach to both names to be compatible with current backend implementation
    this.getSocket()?.on('notification_received', cb);
    this.getSocket()?.on('followup_notification', cb);
  }
  offNotification(cb) {
    this.getSocket()?.off('notification_received', cb);
    this.getSocket()?.off('followup_notification', cb);
  }
  onNotifications(cb) { this.getSocket()?.on('notifications', cb); } // batch list
  offNotifications(cb) { this.getSocket()?.off('notifications', cb); }

  // Also listen for backend's followup_notification event (legacy/name used in server cron)
  // so components using onNotification will get follow-up pushes too.
  onFollowupNotification(cb) {
    this.getSocket()?.on('followup_notification', cb);
  }

  offFollowupNotification(cb) {
    this.getSocket()?.off('followup_notification', cb);
  }

  // event helpers
  onBroadcastReceived(cb) { this.getSocket()?.on('broadcast_received', cb); }
  onGroupMessages(cb) { this.getSocket()?.on('group_messages', cb); }
  onJoinedGroup(cb) { this.getSocket()?.on('joined_group', cb); }
  onLeftGroup(cb) { this.getSocket()?.on('left_group', cb); }
  onBroadcastSent(cb) { this.getSocket()?.on('broadcast_sent', cb); }

  offBroadcastReceived(cb) { this.getSocket()?.off('broadcast_received', cb); }
  offGroupMessages(cb) { this.getSocket()?.off('group_messages', cb); }
  // generic notification off helpers already defined above

  on(event, cb) { this.getSocket()?.on(event, cb); }
  off(event, cb) { this.getSocket()?.off(event, cb); }

  testConnection() {
    if (this.socket && this.isConnected) this.socket.emit('test_connection', { message: 'Frontend test', time: new Date().toISOString() });
  }
}

const socketService = new SocketService();
if (typeof window !== 'undefined') window.socketService = socketService;
export default socketService;
