import {
  Button,
  Divider,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
} from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InlineDiamond from '../components/InlineDiamond';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
} from '../lib/graphql/operations/task.graphql';
import {
  useCreateTaskReceiptMutation,
  useReceiptsQuery,
} from '../lib/graphql/operations/taskreceipt.graphql';
import {
  useCreateTaskSeriesMutation,
  useDeleteTaskSeriesMutation,
  useDeleteTaskSeriesSubsectionMutation,
} from '../lib/graphql/operations/taskseries.graphql';
import {
  useCreateTaskTypeMutation,
  useRemoveTaskTypeMutation,
  useTaskTypesQuery,
} from '../lib/graphql/operations/tasktype.graphql';

const refetchOptions = { refetchQueries: ['OpenTasks'] };

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
  const {
    data: receiptsData,
    loading: receiptsLoading,
    error: receiptsError,
    refetch: receiptsRefetch,
  } = useReceiptsQuery();

  const [createType] = useCreateTaskTypeMutation();
  const [createTask] = useCreateTaskMutation(refetchOptions);
  const [createSeries] = useCreateTaskSeriesMutation(refetchOptions);
  const [removeType] = useRemoveTaskTypeMutation();
  const [deleteTask] = useDeleteTaskMutation(refetchOptions);
  const [deleteSeries] = useDeleteTaskSeriesMutation(refetchOptions);
  const [deleteSeriesSubsection] =
    useDeleteTaskSeriesSubsectionMutation(refetchOptions);
  const [createReceipt] = useCreateTaskReceiptMutation(refetchOptions);

  let selectedTypeId: string;
  let selectedSeriesTypeId: string;

  return (
    <>
      <p>{t('title')}</p>
      {(typesError || tasksError || receiptsError) && (
        <>
          {typesError?.name}: {typesError?.message}
          {tasksError?.name}: {tasksError?.message}
          {receiptsError?.name}: {receiptsError?.message}
        </>
      )}
      {(typesLoading || tasksLoading || receiptsLoading) && (
        <>
          {typesLoading && <>{t('loading-task-types')}</>}
          {tasksLoading && <>{t('loading-tasks')}</>}
          {tasksLoading && <>{t('loading-receipts')}</>}
        </>
      )}

      <Divider />
      <br />
      <Divider />

      {typesData && (
        <>
          <List
            sx={{ width: '100%', maxWidth: 420 }}
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                {t('subtitle-task-types')}
              </ListSubheader>
            }
          >
            {typesData.taskTypes.map((type) => (
              <ListItem key={type.id}>
                <ListItemText>
                  {t('id')}: {type.id}; {t('name')}: {type.name};{' '}
                  <InlineDiamond />: {type.points}
                </ListItemText>
                <Button>
                  <ListItemButton onClick={() => handleRemoveType(type.id)}>
                    {t('remove-type')}
                  </ListItemButton>
                </Button>
              </ListItem>
            ))}
          </List>
          <Input
            id={'inputTypeName'}
            type={'text'}
            placeholder={t('task-type-placeholder-name')}
          />
          <Input id={'inputTypePoints'} type={'number'} defaultValue={'0'} />
          <Button onClick={handleCreateType}>{t('create-task-type')}</Button>
        </>
      )}

      <Divider />
      <br />
      <Divider />

      {tasksData && (
        <>
          <List
            sx={{ width: '100%', maxWidth: 720 }}
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                {t('subtitle-tasks')}{' '}
              </ListSubheader>
            }
          >
            {tasksData.tasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText>
                  {t('id')}: {task.id}; {t('date')}: {task.date}; {t('type')}:{' '}
                  {task.type.name}; {t('series')}: {task.series?.id};{' '}
                  {t('completed')}:{' '}
                  {task.receipt ? `true (receipt ${task.receipt.id})` : 'false'}
                </ListItemText>
                <Button>
                  <ListItemButton onClick={() => handleDeleteTask(task.id)}>
                    {t('delete-task')}
                  </ListItemButton>
                </Button>
                <Button>
                  <ListItemButton onClick={() => handleCompleteTask(task.id)}>
                    {t('complete-task')}
                  </ListItemButton>
                </Button>
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
          <Button onClick={handleCreateTask}>{t('create-task')}</Button>

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
          <Button onClick={handleCreateSeries}>
            {t('create-task-series')}
          </Button>

          <br />

          <Input
            id={'inputDeleteSeriesId'}
            type={'text'}
            placeholder={t('delete-task-series-placeholder')}
          />
          <Button onClick={handleDeleteSeries}>
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
          <Button onClick={handleDeleteSeriesSubsection}>
            {t('delete-task-series-subsection')}
          </Button>

          <Divider />
          <br />
          <Divider />

          {receiptsData && (
            <List
              sx={{ width: '100%', maxWidth: 720 }}
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  {t('subtitle-receipts')}{' '}
                </ListSubheader>
              }
            >
              {receiptsData.receipts.map((receipt) => (
                <ListItem key={receipt.id}>
                  <ListItemText>
                    {t('id')}: {receipt.id}; {t('completion-date')}:{' '}
                    {receipt.completionDate}; {t('type')}: {receipt.name};{' '}
                    {<InlineDiamond />}: {receipt.points}; {t('completer')}:{' '}
                    {receipt.completer.name}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </>
  );

  function handleCreateType() {
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
      createType({
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

  function handleCreateTask() {
    const dateElement = document.getElementById(
      'inputTaskDate'
    ) as HTMLInputElement;
    const date = dateElement.value;

    if (date && selectedTypeId && date.trim() !== '' && selectedTypeId !== '') {
      createTask({
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

  function handleCreateSeries() {
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
      createSeries({
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

  function handleDeleteSeries() {
    const seriesElement = document.getElementById(
      'inputDeleteSeriesId'
    ) as HTMLInputElement;
    const series = seriesElement.value;

    if (series && series.trim() !== '') {
      deleteSeries({
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

  function handleDeleteSeriesSubsection() {
    const seriesElement = document.getElementById(
      'inputDeleteSeriesSubId'
    ) as HTMLInputElement;
    const series = seriesElement.value;

    const startElement = document.getElementById(
      'inputDeleteSeriesSubStart'
    ) as HTMLInputElement;
    const start = startElement.value;

    if (series && series.trim() !== '' && start && start.trim() !== '') {
      deleteSeriesSubsection({
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

  function handleRemoveType(type: string) {
    removeType({ variables: { type: type } })
      .then(() => typesRefetch())
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }

  function handleDeleteTask(task: string) {
    deleteTask({ variables: { task: task } })
      .then(() => tasksRefetch())
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }

  function handleCompleteTask(task: string) {
    createReceipt({ variables: { task: task } })
      .then(() => {
        tasksRefetch();
        receiptsRefetch();
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['tasks', 'common'])),
    },
  };
};

export default Tasks;
