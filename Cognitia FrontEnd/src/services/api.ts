const API_BASE_URL = 'http://localhost:8000';

export const apiService = {
  async sendMessage(question: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to send message. Please check if the backend is running.');
    }
  },

  async generateDebate(question: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/query?debate=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Debate API Error:', error);
      throw new Error('Failed to generate debate.');
    }
  },

  async prepareTopic(topic: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message || 'Topic prepared successfully';
    } catch (error) {
      console.error('Prepare API Error:', error);
      throw new Error('Failed to prepare topic.');
    }
  },
};