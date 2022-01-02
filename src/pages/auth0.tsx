import { NextPage } from 'next';
import Link from '../components/Link';
import { useUserQuery } from '../lib/graphql/operations/user.graphql';

const Auth0Test: NextPage = () => {
  const { loading, error, data } = useUserQuery();

  if (loading) return <>Loading...</>;
  if (error)
    return (
      <>
        {error.name}: {error.message}
      </>
    );

  return (
    <>
      {data?.user ? (
        <>
          Welcome {data.user.name}! You have {data.user.points} Points.{' '}
          <Link href="/api/auth/logout">Logout</Link>
        </>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </>
  );
};

export default Auth0Test;
