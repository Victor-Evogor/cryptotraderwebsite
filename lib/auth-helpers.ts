import { auth } from './firebase';

export async function getAuthToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  
  try {
    const token = await currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}
