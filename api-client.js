const BASE_URL = 'http://localhost:3000';

const apiClient = {
  setSession(sessionId, handle) {
    localStorage.setItem('session_id', sessionId);
    localStorage.setItem('handle', handle);
  },

  clearSession() {
    localStorage.removeItem('session_id');
    localStorage.removeItem('handle');
  },

  getSessionId() {
    return localStorage.getItem('session_id');
  },

  getHandle() {
    return localStorage.getItem('handle');
  },

  async fetchWithAuth(method, endpoint, body = null) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Session-ID': this.getSessionId()
    };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  async register(handle, email, password) {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${BASE_URL}/session/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    this.setSession(data.session_id, data.handle);
    return data;
  },

  async logout() {
    const data = await this.fetchWithAuth('DELETE', '/session');
    this.clearSession();
    return data;
  },

  async getUser(handle) {
    return this.fetchWithAuth('GET', `/users/${handle}`);
  },

  async deleteUser() {
    const data = await this.fetchWithAuth('DELETE', `/users/${this.getHandle()}`);
    this.clearSession();
    return data;
  },

  async follow(followed_handle) {
    return this.fetchWithAuth('POST', '/follow', { followed_handle });
  },

  async unfollow(followed_handle) {
    return this.fetchWithAuth('DELETE', `/follow/${followed_handle}`);
  },

  async createPost(content, replied_message = null) {
    return this.fetchWithAuth('POST', '/posts', { content, replied_message });
  },

  async getLatestPosts() {
    const response = await fetch(`${BASE_URL}/posts`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch posts');
    return data;
  },

  async getUserPosts(handle) {
    const response = await fetch(`${BASE_URL}/posts/user/${handle}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch posts');
    return data;
  },

  async getFollowingPosts() {
    return this.fetchWithAuth('GET', '/posts/following');
  },

  async searchPosts(query) {
    const response = await fetch(`${BASE_URL}/posts/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to search posts');
    return data;
  }
};

export default apiClient;