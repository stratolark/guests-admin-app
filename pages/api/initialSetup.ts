import { NextApiRequest, NextApiResponse } from 'next';
import { getFirebaseAdmin } from 'next-firebase-auth';
import initAuth from 'utils/initAuth';

initAuth();
// TODO: delete this file after the initial setup is done.
export default async function InitialSetup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('REQ', req.headers);
  console.log('REQ', req.body);

  switch (req.method) {
    case 'GET':
      res.status(404).end(
        JSON.stringify({
          status: '404',
          error: 'Not Found',
        })
      );
      break;
    case 'POST':
      if (req.headers.authorization === 'Bearer one-time-setup') {
        // get user and add admin custom claim
        return getFirebaseAdmin()
          .auth()
          .getUserByEmail(req.body.email)
          .then((user) => {
            return getFirebaseAdmin()
              .auth()
              .updateUser(user.uid, { emailVerified: true });
          })
          .then((user) => {
            return getFirebaseAdmin()
              .auth()
              .setCustomUserClaims(user.uid, req.body.roles);
          })
          .then(() => {
            return res.status(200).json({
              response: req.body.roles,
              message: `Success! ${req.body.email} has been verified and made an admin.`,
            });
          })
          .catch((err) => {
            return res.end(
              JSON.stringify({
                status: 'error',
                error: err,
              })
            );
          });
      }
      return res.status(404).end(
        JSON.stringify({
          status: '404',
          message: 'No cookie.',
        })
      );

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(
        JSON.stringify({
          error: `Method ${req.method} Not Allowed`,
        })
      );
  }
}
