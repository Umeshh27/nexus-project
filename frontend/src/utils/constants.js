// ─── Application Constants ─────────────────

export const API_URL = import.meta.env.VITE_API_URL || '/api';

const RENDER_API_BASE_URL = 'https://nexus-project-09qo.onrender.com';

export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return '';

  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';

  return isLocalHost ? '' : RENDER_API_BASE_URL;
};

export const API_BASE_URL = getApiBaseUrl();

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest',
};

export const PERMISSION_LEVELS = [
  { value: 'admin', label: 'Admin Only', description: 'Only admins can access' },
  { value: 'member', label: 'Members & Admins', description: 'Members and admins can access' },
  { value: 'guest', label: 'Everyone', description: 'All users including guests can access' },
];

export const ACCEPTED_FILE_TYPES = ['.pdf', '.docx', '.txt'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  FILE_UPLOAD: 'FILE_UPLOAD',
  FILE_DELETE: 'FILE_DELETE',
  QUERY_SENT: 'QUERY_SENT',
  ROLE_CHANGE: 'ROLE_CHANGE',
  USER_DEACTIVATED: 'USER_DEACTIVATED',
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
};
