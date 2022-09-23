import axios from 'axios';
import { AuthUserContext } from 'next-firebase-auth';

const SET_CUSTOMS_CLAIMS_ENDPOINT = 'api/claims';
interface UserRequest {
  user: string;
  role: {
    [key: string]: boolean;
  };
}

export async function setAdminWithCredentials(
  authUser: AuthUserContext,
  credentials: AuthUserContext,
  request: UserRequest
) {
  const { claims, email, emailVerified, id } = credentials;
  const { user, role } = request;
  const token = await authUser.getIdToken();
  const response = await axios.post(
    SET_CUSTOMS_CLAIMS_ENDPOINT,
    {
      credentials: { claims, email, emailVerified, id, token },
      request: { user, role },
    }
    // { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('setAdminWithCredentials', response);
  return response;
}
