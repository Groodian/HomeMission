import {
  AfterCallback,
  handleAuth,
  handleCallback,
  HandlerError,
} from '@auth0/nextjs-auth0';
import User from '../../../entities/user';
import databaseConnection from '../../../lib/typeorm/connection';

const afterCallback: AfterCallback = async (req, res, session) => {
  await databaseConnection();

  const user = (await User.findOne(session.user.sub as string)) || new User();

  // set properties and save if user is new
  if (!user.id) {
    user.id = session.user.sub;
    user.name = session.user.name;
    user.picture = session.user.picture;
    await user.save();
  }

  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      if (error instanceof HandlerError)
        res.status(error.status || 500).end(error.message);
    }
  },
});
