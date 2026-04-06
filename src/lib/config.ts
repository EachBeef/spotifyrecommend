/**
 * Configuração de ambiente para o proxy
 * 
 * IMPORTANTE: Substitua BACKEND_URL pela URL do seu servidor FastAPI
 * Exemplo: https://abc123.ngrok.io (fornecido pelo ngrok)
 */

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  contentBased: (songTitle: string) => `/recommendations/content-based/${encodeURIComponent(songTitle)}`,
  genreArtist: '/recommendations/genre-artist',
  collaborative: (userId: string) => `/recommendations/collaborative/${userId}`,
  hybrid: '/recommendations/hybrid',
  popular: '/recommendations/popular',
};
