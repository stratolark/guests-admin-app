import { getFirebaseAdmin } from 'next-firebase-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import initAuth from '../../utils/initAuth';

initAuth();

async function ListUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (req.headers.authorization) {
      return getFirebaseAdmin()
        .auth()
        .listUsers(99)
        .then((listUsersResult) => {
          const usersList = listUsersResult.users.map((userRecord) => {
            return {
              uid: userRecord.uid,
              displayName: userRecord.displayName,
              email: userRecord.email,
              emailVerified: userRecord.emailVerified,
              customClaims: userRecord.customClaims,
              photoURL: userRecord.photoURL,
            };
          });
          return res.status(200).json({
            data: usersList,
          });
        })
        .catch((error) => {
          console.log('Error listing users:', error);
          return res.end(
            JSON.stringify({
              status: 'error',
              error: error,
            })
          );
        });
    }
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end(
    JSON.stringify({
      error: `Method ${req.method} Not Allowed`,
    })
  );
}

export default ListUsers;
