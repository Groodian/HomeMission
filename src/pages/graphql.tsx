import { NextPage } from 'next';
import React, { useState } from 'react';
import {
  useUpdateNameMutation,
  useUserQuery,
} from '../lib/graphql/operations/user.graphql';

const GraphQLTest: NextPage = () => {
  const { loading, error, data } = useUserQuery();
  const [newName, setNewName] = useState('');
  const [updateName, { loading: updateLoading, error: updateError }] =
    useUpdateNameMutation();

  const onChangeName = async () => {
    try {
      await updateName({
        variables: {
          name: newName,
        },
      });
    } catch (error) {
      // Prevent error popup. Update error is handled below
    }
  };

  if (loading || updateLoading) return <>Loading...</>;
  if (error) return <>Error: {error.message}</>;
  if (updateError) return <>Error: {updateError.message}</>;

  if (data)
    return (
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
    );

  return <></>;
};

export default GraphQLTest;
