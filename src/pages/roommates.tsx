import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRoommatesQuery } from '../lib/graphql/operations/user.graphql';

const RoommatesTest: NextPage = () => {
  const { loading, error, data } = useRoommatesQuery();

  return (
    <>
      {loading && 'Loading...'}
      {error && (
        <>
          {error.name}: {error.message}
        </>
      )}
      {data && (
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Picture</th>
              <th>Points</th>
            </tr>
            {data.roommates.map((roommate) => (
              <tr key={roommate.id}>
                <td>{roommate.name}</td>
                <td>
                  <Image
                    src={roommate.picture}
                    alt={`Profile picture of ${roommate.name}`}
                    width={40}
                    height={40}
                  />
                </td>
                <td>{roommate.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default withPageAuthRequired(RoommatesTest);
