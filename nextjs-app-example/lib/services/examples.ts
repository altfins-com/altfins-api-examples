/**
 * Examples of using API service with API key
 */

import {
  get,
  post,
  setApiKey,
  getApiConfig,
  resetApiKey,
} from '@/lib/services';

// ============================================
// 1. AUTOMATIC API KEY SETUP
// ============================================

// From environment variable (automatically at start)
// No action needed, API key is set from NEXT_PUBLIC_API_KEY

// ============================================
// 2. MANUAL API KEY SETUP
// ============================================

// Set API key at application start (e.g. in layout.tsx)
setApiKey('your-secret-api-key-123');

// Set API key with custom header name
setApiKey('your-secret-api-key-123', 'Authorization');

// ============================================
// 3. USAGE WITH AUTOMATIC API KEY
// ============================================

// GET request - API key is added automatically
export async function fetchUsers() {
  const response = await get('https://altfins.com/');
  if (response.success) {
    console.log('Users:', response.data);
  } else {
    console.error('Error:', response.error);
  }
}

// POST request - API key is added automatically
export async function createUser(name: string, email: string) {
  const response = await post('https://api.example.com/users', {
    name,
    email,
  });
  return response;
}

// ============================================
// 4. CALLING WITHOUT API KEY
// ============================================

// If you want to call endpoint without API key
export async function fetchPublicData() {
  const response = await get('https://api.example.com/public', {
    includeApiKey: false,
  } as any);
  return response;
}

// ============================================
// 5. CUSTOM HEADERS WITH API KEY
// ============================================

// API key is added automatically along with custom headers
export async function fetchWithCustomHeaders() {
  const response = await get('https://api.example.com/data', {
    'Custom-Header': 'custom-value',
  });
  return response;
}

// ============================================
// 6. API KEY CONFIGURATION
// ============================================

// Get current configuration
export function checkConfig() {
  const config = getApiConfig();
  console.log('API configuration:', config);
}

// Reset API key
export function logout() {
  resetApiKey();
}

// ============================================
// 7. EXAMPLE IN REACT COMPONENT
// ============================================

/*
'use client';

import { useEffect, useState } from 'react';
import { get, setApiKey } from '@/lib/services';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set API key at the beginning
    setApiKey(process.env.NEXT_PUBLIC_API_KEY || '');

    const fetchUsers = async () => {
      try {
        const response = await get<User[]>('https://api.example.com/users');
        if (response.success && response.data) {
          setUsers(response.data);
        } else {
          setError(response.error || 'Unknown error');
        }
      } catch (err) {
        setError('Error loading users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
*/

// ============================================
// 8. EXAMPLE IN API ROUTE
// ============================================

/*
// app/api/users/route.ts
import { get, setApiKey } from '@/lib/services';

export async function GET() {
  // Set API key from environment variable
  setApiKey(process.env.API_KEY || '');

  const response = await get('https://external-api.example.com/users');

  if (response.success) {
    return Response.json(response.data);
  } else {
    return Response.json({ error: response.error }, { status: 500 });
  }
}
*/
