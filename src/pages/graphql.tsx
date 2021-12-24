import { NextPage } from 'next';
import React, { useState } from 'react';
import {
  useUpdateNameMutation,
  useUserQuery,
} from '../lib/graphql/operations/user.graphql';

const GraphQLTest: NextPage = () => {
  const { loading, error, data } = useUserQuery();
  const [newName, setNewName] = useState('');
  const [updateNameMutation] = useUpdateNameMutation();

  const onChangeName = () => {
    updateNameMutation({
      variables: {
        name: newName,
      },
    });
  };

  return (
    <>
      {loading && 'Loading...'}
      {error && 'Error: ' + error.message}
      {data && (
        <div>
          You&apos;re signed in as {data.user.name} and you&apos;re{' '}
          {data.user.status}.
          <div>
            <input
              type="text"
              placeholder="your new name..."
              onChange={(e) => setNewName(e.target.value)}
            />
            <input type="button" value="change" onClick={onChangeName} />
          </div>
        </div>
      )}
    </>
  );
};

export default GraphQLTest;
