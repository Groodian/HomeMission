import React from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Slider,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import { DatePicker, LoadingButton } from '@mui/lab';
import { Delete } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  useCreateTaskTypeMutation,
  useDeleteTaskTypeMutation,
  useTaskTypesQuery,
} from '../../lib/graphql/operations/tasktype.graphql';
import { useCreateTaskMutation } from '../../lib/graphql/operations/task.graphql';
import { useCreateTaskSeriesMutation } from '../../lib/graphql/operations/taskseries.graphql';
import TaskType from '../../entities/tasktype';
import InlineDiamond from '../InlineDiamond';

type AddTaskDialogProps = {
  newTaskDate?: Date;
  onCloseDialog?: () => void;
};
const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  newTaskDate,
  onCloseDialog = () => undefined,
}) => {
  const { t } = useTranslation('overview', { keyPrefix: 'AddTaskDialog' });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { error, data } = useTaskTypesQuery();
  const [deleteType] = useDeleteTaskTypeMutation({
    refetchQueries: ['TaskTypes'],
  });
  const [createType, { loading: typeLoading, reset: typeReset }] =
    useCreateTaskTypeMutation({ refetchQueries: ['TaskTypes'] });
  const [createTask, { loading: taskLoading, reset: taskReset }] =
    useCreateTaskMutation({ refetchQueries: ['Tasks', 'OpenTasks'] });
  const [createSeries, { loading: seriesLoading, reset: seriesReset }] =
    useCreateTaskSeriesMutation({ refetchQueries: ['Tasks', 'OpenTasks'] });
  const loading = typeLoading || taskLoading || seriesLoading;

  const [date, setDate] = React.useState<number | null>(null);
  const [type, setType] = React.useState('');
  const [points, setPoints] = React.useState(50);
  const [recurring, setRecurring] = React.useState(false);
  const [interval, setInterval] = React.useState('');
  const [iterations, setIterations] = React.useState('');

  // Set initial values whe dialog is opened again
  React.useEffect(() => {
    typeReset();
    taskReset();
    seriesReset();
    setDate(newTaskDate?.getTime() || null);
    setType('');
    setPoints(50);
    setRecurring(false);
    setInterval('');
    setIterations('');
  }, [newTaskDate]);

  React.useEffect(() => {
    if (error) enqueueSnackbar(t('load-type-error'), { variant: 'error' });
  }, [error]);

  const selectedType = data?.taskTypes.find(({ name }) => name === type);

  async function handleDeleteType(typeName: string) {
    const typeId = data?.taskTypes.find(({ name }) => name === typeName)?.id;
    try {
      await deleteType({ variables: { type: typeId || '' } });
      enqueueSnackbar(t('delete-type-success', { type: typeName }), {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(t('delete-type-error', { type: typeName }), {
        variant: 'error',
      });
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    if (date && date >= today.getTime()) {
      // Create new task type if it does not exits
      let createdType: TaskType | undefined = undefined;
      if (!selectedType) {
        if (!type) return;
        try {
          const { data } = await createType({
            variables: { name: type, points: points },
          });
          createdType = data?.createTaskType as TaskType;
          enqueueSnackbar(t('create-type-success', { type }), {
            variant: 'success',
          });
        } catch (err) {
          enqueueSnackbar(t('create-type-error', { type }), {
            variant: 'error',
          });
          onCloseDialog();
          return;
        }
      }

      // Create one task or series of tasks
      if (!recurring) {
        try {
          await createTask({
            variables: {
              date,
              type: selectedType?.id || createdType?.id || '',
            },
          });
          enqueueSnackbar(t('create-task-success'), { variant: 'success' });
        } catch (err) {
          enqueueSnackbar(t('create-task-error'), { variant: 'error' });
        }
      } else {
        try {
          await createSeries({
            variables: {
              start: date,
              type: selectedType?.id || createdType?.id || '',
              interval: Number(interval),
              iterations: Number(iterations),
            },
          });
          enqueueSnackbar(t('create-series-success'), { variant: 'success' });
        } catch (err) {
          enqueueSnackbar(t('create-series-error'), { variant: 'error' });
        }
      }
      onCloseDialog();
    }
  };

  return (
    <Dialog
      open={newTaskDate !== undefined}
      aria-labelledby="dialog-title"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="dialog-title">{t('add-task')}</DialogTitle>
        <DialogContent sx={{ overflow: 'visible', mt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <DatePicker
                label={t('date-label')}
                value={date}
                onChange={(newDate) => newDate && setDate(newDate.valueOf())}
                minDate={Date.now()}
                mask={router.locale === 'de' ? '__.__.____' : '__/__/____'}
                renderInput={(params) => <TextField {...params} required />}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label={t('type-label')} required />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option}
                    <Tooltip
                      title={t('delete-type', { type: option }) as string}
                      placement="right"
                    >
                      <IconButton
                        size="small"
                        sx={{ ml: 'auto' }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteType(option);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </li>
                )}
                options={data?.taskTypes.map((type) => type.name) || []}
                value={type}
                onInputChange={(event, newType) => setType(newType.trim())}
                autoComplete
                disableClearable
                disabled={loading}
              />
            </Grid>
            <Grid item xs={4} sx={{ alignSelf: 'center' }}>
              <Box mx={2}>
                <Slider
                  disabled={selectedType !== undefined || loading}
                  value={selectedType?.points || points}
                  onChange={(event, value) => setPoints(value as number)}
                  step={10}
                  min={10}
                  max={100}
                  marks
                  valueLabelDisplay="on"
                  valueLabelFormat={(value) => (
                    <>
                      {value} <InlineDiamond />
                    </>
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ mt: 1, textAlign: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    value={recurring}
                    onChange={(event, checked) => setRecurring(checked)}
                  />
                }
                label={t('recurring-label') as string}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                label={t('interval-label') as string}
                helperText={t('interval-helper')}
                required
                value={recurring ? interval : ''}
                onChange={(event) => {
                  const number = parseInt(event.target.value);
                  if ((number >= 1 && number <= 52) || !number)
                    setInterval(event.target.value);
                }}
                inputProps={{ min: 1, max: 52 }}
                disabled={!recurring || loading}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                label={t('iterations-label') as string}
                helperText={t('iterations-helper')}
                required
                value={recurring ? iterations : ''}
                onChange={(event) => {
                  const number = parseInt(event.target.value);
                  if ((number >= 1 && number <= 52) || !number)
                    setIterations(event.target.value);
                }}
                inputProps={{ min: 1, max: 52 }}
                disabled={!recurring || loading}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onCloseDialog} disabled={loading}>
            {t('dialog-cancel')}
          </Button>
          <LoadingButton type="submit" loading={loading}>
            {recurring ? t('add-tasks') : t('add-task')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTaskDialog;
