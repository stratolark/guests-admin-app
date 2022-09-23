import { getFirebaseAdmin } from 'next-firebase-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import initAuth from '../../utils/initAuth';

initAuth();

const Claims = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      // Get data from your database
      res.status(404).end(
        JSON.stringify({
          status: '404',
          error: 'Not Found',
        })
      );
      break;
    case 'POST':
      if (req.headers.cookie && req.body.credentials.claims.admin === true) {
        // get user and add admin custom claim
        return getFirebaseAdmin()
          .auth()
          .getUserByEmail(req.body.request.user)
          .then((user) => {
            return getFirebaseAdmin()
              .auth()
              .setCustomUserClaims(user.uid, req.body.request.role);
          })
          .then(() => {
            return res.status(200).json({
              response: req.body.request.role,
              message: `Success! ${req.body.request.user} has been made an admin.`,
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
          message: 'Not found.',
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
};

export default Claims;
