import React from 'react';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import { Task } from '../../entities';
import { useDeleteTaskMutation } from '../../lib/graphql/operations/task.graphql';
import {
  useDeleteTaskSeriesMutation,
  useDeleteTaskSeriesSubsectionMutation,
} from '../../lib/graphql/operations/taskseries.graphql';

export enum Type {
  single,
  series_all,
  series_sub,
}
type DeleteButtonProps = {
  task: Task;
  type: Type;
};
const DeleteButton: React.FC<DeleteButtonProps> = ({ task, type }) => {
  const { t } = useTranslation('common');

  const refetchOptions = { refetchQueries: ['Tasks', 'OpenTasks'] };
  const [useDeleteTask, { loading: loadingSingle }] =
    useDeleteTaskMutation(refetchOptions);
  const [useDeleteTaskSeries, { loading: loadingSeriesAll }] =
    useDeleteTaskSeriesMutation(refetchOptions);
  const [useDeleteTaskSeriesSubsection, { loading: loadingSeriesSub }] =
    useDeleteTaskSeriesSubsectionMutation(refetchOptions);

  const buttonText =
    type === Type.single
      ? t('delete-single')
      : type === Type.series_all
      ? t('delete-all')
      : t('delete-sub');

  return (
    <LoadingButton
      sx={{ width: '100%', marginTop: '0.5em' }}
      variant={'outlined'}
      color={'error'}
      loading={loadingSingle || loadingSeriesAll || loadingSeriesSub}
      onClick={() => {
        switch (type) {
          case Type.single:
            useDeleteTask({ variables: { task: task.id } });
            break;
          case Type.series_all:
            if (task.series)
              useDeleteTaskSeries({
                variables: { series: task.series?.id },
              });
            break;
          case Type.series_sub:
            if (task.series)
              useDeleteTaskSeriesSubsection({
                variables: { series: task.series?.id, start: task.id },
              });
            break;
        }
      }}
    >
      {buttonText}
    </LoadingButton>
  );
};

export default DeleteButton;
