import { useUser } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import Link from '../components/Link';

const Auth0Test: NextPage = () => {
  const { isLoading, error, user } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! <Link href="/api/auth/logout">Logout</Link>
      </div>
    );
  }

  return <Link href="/api/auth/login">Login</Link>;
};

export default Auth0Test;
