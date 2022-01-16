import { GetStaticProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useCreateTaskTypeMutation,
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

const Tasks: NextPage = () => {
  const { t } = useTranslation('tasks');

  const {
    data: taskTypesData,
    loading: taskTypesLoading,
    error: taskTypesError,
    refetch: taskTypesRefetch,
  } = useTaskTypesQuery();
  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
    refetch: tasksRefetch,
  } = useTasksQuery();

  const [useCreateTaskType] = useCreateTaskTypeMutation();
  const [useCreateTask] = useCreateTaskMutation();
  const [useDeleteTask] = useDeleteTaskMutation();

  let selectedTypeId: string;

  return (
    <>
      <p>{t('title')}</p>
      {(taskTypesError || tasksError) && (
        <>
          {taskTypesError?.name}: {taskTypesError?.message}
          {tasksError?.name}: {tasksError?.message}
        </>
      )}
      {(taskTypesLoading || tasksLoading) && (
        <>
          {taskTypesLoading && <>{t('loading-task-types')}</>}
          {tasksLoading && <>{t('loading-tasks')}</>}
        </>
      )}

      {taskTypesData && (
        <>
          <List sx={{ width: '100%', maxWidth: 360 }}>
            <ListItem>
              <ListItemText>{t('subtitle-task-types')}</ListItemText>
            </ListItem>
            {taskTypesData.taskTypes.map((taskType) => (
              <ListItem key={taskType.id}>
                <ListItemText>
                  {t('id')}: {taskType.id}; {t('name')}: {taskType.name};{' '}
                  {t('points')}: {taskType.points}
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
          <Button onClick={() => createTaskType()}>
            {t('create-task-type')}
          </Button>
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
                  {task.type.name}
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Input
            id={'inputTaskDate'}
            type={'text'}
            placeholder={t('task-placeholder-date')}
          />
          {taskTypesData && (
            <Select
              id={'inputTaskType'}
              defaultValue={''}
              onChange={(event) => (selectedTypeId = event.target.value)}
            >
              {taskTypesData?.taskTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          )}
          <Button onClick={() => createTask()}>{t('create-task')}</Button>
        </>
      )}
    </>
  );

  function createTaskType() {
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
      useCreateTaskType({
        variables: {
          name: name,
          points: Number(points),
        },
      })
        .then(() => taskTypesRefetch())
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
