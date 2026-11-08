/**
 * J.A.R.V.I.S Secure Backend API Client
 *
 * NOTE: Keeps all private API keys off the client side.
 * Requests are forwarded to a secure backend server (Python FastAPI / Node.js Express)
 * specified by VITE_BACKEND_URL.
 */

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

export const apiService = {
  getBaseUrl() {
    return BACKEND_BASE_URL;
  },

  /**
   * Check connection to the backend server.
   */
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BACKEND_BASE_URL}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return { online: true, data };
      }
      return { online: false, error: `HTTP ${res.status}` };
    } catch (err) {
      return {
        online: false,
        error: 'Backend offline or unreachable. Running in client simulated mode.',
      };
    }
  },

  /**
   * Module 1: General Intelligence (Chat & Code Synthesis)
   */
  async sendChat({ message, model, systemPrompt, history }) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, systemPrompt, history }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        success: false,
        isSimulated: true,
        error: err.message,
        reply: `[LOCAL PROTOCOL] Backend at ${BACKEND_BASE_URL} is currently offline. To enable live neural responses, start your backend server. Query logged: "${message}"`,
      };
    }
  },

  /**
   * Module 4: Knowledge & Web Search
   */
  async searchWeb({ query, mode }) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode }),
      });
      if (!res.ok) throw new Error(`Search failed with status ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        success: false,
        isSimulated: true,
        error: err.message,
        query,
      };
    }
  },

  /**
   * Module 5: Vision & Multimodal Inspection
   */
  async analyzeImage({ imageFile, imageUrl, prompt }) {
    try {
      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      if (imageUrl) formData.append('imageUrl', imageUrl);
      formData.append('prompt', prompt);

      const res = await fetch(`${BACKEND_BASE_URL}/vision`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Vision inference failed with status ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        success: false,
        isSimulated: true,
        error: err.message,
      };
    }
  },

  /**
   * Module 3: Memory Operations
   */
  async syncMemories(memories) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memories }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, isSimulated: true, error: err.message };
    }
  },

  /**
   * Module 6: Task Management
   */
  async syncTasks(tasks) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, isSimulated: true, error: err.message };
    }
  },
};
