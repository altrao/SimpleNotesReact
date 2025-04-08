import { getAccessToken, refreshAccessToken } from './auth';

export interface Note {
  id: string;
  version?: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const handleRequest = async (endpoint: string, options: RequestInit, retry = true) => {
  const token = getAccessToken();
  if (!token) throw new Error('No authentication token found');

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  try {
    const url = `/api/notes${endpoint}`;
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      if (retry) {
        await refreshAccessToken();
        return handleRequest(endpoint, options, false); // Retry once
      }
      throw new Error("Unauthorized", { cause: 401 })
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const getNotes = async (): Promise<Note[]> => {
  const response = await handleRequest('', {
    method: 'GET',
  });

  return await response.json();
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await handleRequest(`/${id}`, {
    method: 'GET',
  });

  return await response.json();
};

export const updateNote = async (id: string, note: { title: string; content: string }): Promise<Note> => {
  const response = await handleRequest(`/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  return await response.json();
};

export const deleteNote = async (id: string): Promise<void> => {
  await handleRequest(`/${id}`, {
    method: 'DELETE',
  });
};

export const createNote = async (note: { title: string; content: string }): Promise<Note> => {
  const response = await handleRequest('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  return await response.json();
};

export const getNoteVersions = async (id: string): Promise<Note[]> => {
  const response = await handleRequest(`/${id}/versions`, {
    method: 'GET',
  });

  return await response.json();
};
