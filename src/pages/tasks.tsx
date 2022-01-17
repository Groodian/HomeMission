import { GetStaticProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useCreateTaskTypeMutation,
  useRemoveTaskTypeMutation,
  useTaskTypesQuery,
} from '../lib/graphql/operations/tasktype.graphql';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
} from '../lib/graphql/operations/task.graphql';
import {
  Button,
  Input,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import {
  useCreateTaskSeriesMutation,
  useDeleteTaskSeriesMutation,
  useDeleteTaskSeriesSubsectionMutation,
} from '../lib/graphql/operations/taskseries.graphql';

const Tasks: NextPage = () => {
  const { t } = useTranslation('tasks');

  const {
    data: typesData,
    loading: typesLoading,
    error: typesError,
    refetch: typesRefetch,
  } = useTaskTypesQuery();
  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
    refetch: tasksRefetch,
  } = useTasksQuery();

  const [useCreateType] = useCreateTaskTypeMutation();
  const [useCreateTask] = useCreateTaskMutation();
  const [useCreateSeries] = useCreateTaskSeriesMutation();
  const [useRemoveType] = useRemoveTaskTypeMutation();
  const [useDeleteTask] = useDeleteTaskMutation();
  const [useDeleteSeries] = useDeleteTaskSeriesMutation();
  const [useDeleteSeriesSubsection] = useDeleteTaskSeriesSubsectionMutation();

  let selectedTypeId: string;
  let selectedSeriesTypeId: string;

  return (
    <>
      <p>{t('title')}</p>
      {(typesError || tasksError) && (
        <>
          {typesError?.name}: {typesError?.message}
          {tasksError?.name}: {tasksError?.message}
        </>
      )}
      {(typesLoading || tasksLoading) && (
        <>
          {typesLoading && <>{t('loading-task-types')}</>}
          {tasksLoading && <>{t('loading-tasks')}</>}
        </>
      )}

      {typesData && (
        <>
          <List sx={{ width: '100%', maxWidth: 360 }}>
            <ListItem>
              <ListItemText>{t('subtitle-task-types')}</ListItemText>
            </ListItem>
            {typesData.taskTypes.map((type) => (
              <ListItem
                key={type.id}
                onClick={() => {
                  removeType(type.id);
                }}
              >
                <ListItemText>
                  {t('id')}: {type.id}; {t('name')}: {type.name}; {t('points')}:{' '}
                  {type.points}
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Input
            id={'inputTypeName'}
            type={'text'}
            placeholder={t('task-type-placeholder-name')}
          />
          <Input
            id={'inputTypePoints'}
            type={'number'}
            placeholder={t('task-type-placeholder-points')}
            defaultValue={'0'}
          />
          <Button onClick={() => createType()}>{t('create-task-type')}</Button>
        </>
      )}

      {tasksData && (
        <>
          <List sx={{ width: '100%', maxWidth: 360 }}>
            <ListItem>
              <ListItemText>{t('subtitle-tasks')}</ListItemText>
            </ListItem>
            {tasksData.tasks.map((task) => (
              <ListItem key={task.id} onClick={() => deleteTask(task.id)}>
                <ListItemText>
                  {t('id')}: {task.id}; {t('date')}: {task.date}; {t('type')}:{' '}
                  {task.type.name}; {t('series')}: {task.series?.id}
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Input
            id={'inputTaskDate'}
            type={'text'}
            placeholder={t('task-placeholder-date')}
          />
          {typesData && (
            <Select
              id={'inputType'}
              defaultValue={''}
              onChange={(event) => (selectedTypeId = event.target.value)}
            >
              {typesData?.taskTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          )}
          <Button onClick={() => createTask()}>{t('create-task')}</Button>

          <br />

          <Input
            id={'inputSeriesStart'}
            type={'text'}
            placeholder={t('task-series-placeholder-start')}
          />
          {typesData && (
            <Select
              id={'inputSeriesType'}
              defaultValue={''}
              onChange={(event) => (selectedSeriesTypeId = event.target.value)}
            >
              {typesData?.taskTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          )}
          <Input
            id={'inputSeriesInterval'}
            type={'number'}
            placeholder={t('task-series-placeholder-interval')}
            defaultValue={''}
          />
          <Input
            id={'inputSeriesIterations'}
            type={'number'}
            placeholder={t('task-series-placeholder-iterations')}
            defaultValue={''}
          />
          <Button onClick={() => createSeries()}>
            {t('create-task-series')}
          </Button>

          <br />

          <Input
            id={'inputDeleteSeriesId'}
            type={'text'}
            placeholder={t('delete-task-series-placeholder')}
          />
          <Button onClick={() => deleteSeries()}>
            {t('delete-task-series')}
          </Button>

          <br />

          <Input
            id={'inputDeleteSeriesSubId'}
            type={'text'}
            placeholder={t('delete-series-subsection-placeholder')}
          />
          <Input
            id={'inputDeleteSeriesSubStart'}
            type={'text'}
            placeholder={t('delete-series-subsection-placeholder-start')}
          />
          <Button onClick={() => deleteSeriesSubsection()}>
            {t('delete-task-series-subsection')}
          </Button>
        </>
      )}
    </>
  );

  function createType() {
    const nameElement = document.getElementById(
      'inputTypeName'
    ) as HTMLInputElement;
    const name = nameElement.value;

    const pointsElement = document.getElementById(
      'inputTypePoints'
    ) as HTMLInputElement;
    const points = pointsElement.value;

    if (!name || name.trim() === '') {
      nameElement.value = 'bad value';
    } else if (!points || isNaN(Number(points)) || Number(points) <= 0) {
      pointsElement.value = '-1';
    } else {
      useCreateType({
        variables: {
          name: name,
          points: Number(points),
        },
      })
        .then(() => typesRefetch())
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
          nameElement.value = 'failed, check console';
          pointsElement.value = 'failed, check console';
        })
        .finally(() => {
          nameElement.value = '';
          pointsElement.value = '';
        });
    }
  }

  function createTask() {
    const dateElement = document.getElementById(
      'inputTaskDate'
    ) as HTMLInputElement;
    const date = dateElement.value;

    if (date && selectedTypeId && date.trim() !== '' && selectedTypeId !== '') {
      useCreateTask({
        variables: {
          type: selectedTypeId,
          date: date,
        },
      })
        .then(() => tasksRefetch())
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
          dateElement.value = 'failed, check console';
        })
        .finally(() => {
          dateElement.value = '';
        });
    }
  }

  function createSeries() {
    const startElement = document.getElementById(
      'inputSeriesStart'
    ) as HTMLInputElement;
    const start = startElement.value;

    const iterationsElement = document.getElementById(
      'inputSeriesIterations'
    ) as HTMLInputElement;
    const iterations = Number(iterationsElement.value);

    const intervalElement = document.getElementById(
      'inputSeriesInterval'
    ) as HTMLInputElement;
    const interval = Number(intervalElement.value);

    if (
      start &&
      selectedSeriesTypeId &&
      start.trim() !== '' &&
      selectedSeriesTypeId !== '' &&
      !isNaN(iterations) &&
      !isNaN(interval) &&
      iterations > 0 &&
      interval > 0
    ) {
      useCreateSeries({
        variables: {
          type: selectedSeriesTypeId,
          start: start,
          iterations: iterations,
          interval: interval,
        },
      })
        .then(() => tasksRefetch())
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
          startElement.value = 'failed, check console';
        })
        .finally(() => {
          startElement.value = '';
          iterationsElement.value = '';
          intervalElement.value = '';
        });
    } else {
      startElement.value = 'bad values';
    }
  }

  function deleteSeries() {
    const seriesElement = document.getElementById(
      'inputDeleteSeriesId'
    ) as HTMLInputElement;
    const series = seriesElement.value;

    if (series && series.trim() !== '') {
      useDeleteSeries({
        variables: {
          series: series,
        },
      })
        .then(() => {
          tasksRefetch();
          seriesElement.value = '';
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
          seriesElement.value = 'failed, check console';
        });
    } else {
      seriesElement.value = 'bad values';
    }
  }

  function deleteSeriesSubsection() {
    const seriesElement = document.getElementById(
      'inputDeleteSeriesSubId'
    ) as HTMLInputElement;
    const series = seriesElement.value;

    const startElement = document.getElementById(
      'inputDeleteSeriesSubStart'
    ) as HTMLInputElement;
    const start = startElement.value;

    if (series && series.trim() !== '' && start && start.trim() !== '') {
      useDeleteSeriesSubsection({
        variables: {
          series: series,
          start: start,
        },
      })
        .then(() => {
          tasksRefetch();
          seriesElement.value = '';
          startElement.value = '';
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
          seriesElement.value = 'failed, check console';
        });
    } else {
      seriesElement.value = 'bad values';
    }
  }

  function removeType(type: string) {
    useRemoveType({ variables: { type: type } })
      .then(() => typesRefetch())
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }

  function deleteTask(task: string) {
    useDeleteTask({ variables: { task: task } })
      .then(() => tasksRefetch())
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', [
        '_app',
        'tasks',
        'Navbar',
        'common',
      ])),
    },
  };
};

export default withPageAuthRequired(Tasks);
