import React from 'react';
import {
  Avatar,
  AvatarGroup,
  IconButton,
  inputBaseClasses,
  outlinedInputClasses,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';
import {
  useHomeQuery,
  useRenameHomeMutation,
} from '../../lib/graphql/operations/home.graphql';

const HomeData: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Navbar' });
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useHomeQuery();
  const [renameHome] = useRenameHomeMutation();
  const [nameValue, setNameValue] = React.useState<string>();

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    switch (event.key) {
      case 'Enter':
        handleRenameHome();
        break;
      case 'Escape':
        setNameValue(undefined);
        break;
      default:
    }
  };

  return data?.home ? (
    <>
      <Tooltip
        arrow
        placement="right"
        title={
          <Tooltip title={t('rename-tooltip') as string}>
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setNameValue(data.home?.name)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      >
        <Typography mx="1em" variant={'h4'} component="span">
          {nameValue !== undefined ? (
            <TextField
              id="new-name-input"
              autoFocus
              value={nameValue}
              onChange={({ target: { value } }) => setNameValue(value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRenameHome}
              size="small"
              sx={{
                width: `${(nameValue.length + 2) * 0.56}em`,
                [`& .${inputBaseClasses.input}`]: {
                  fontSize: (theme) => theme.typography.h4.fontSize,
                  color: 'white',
                  fontFamily: 'monospace',
                },
                [`& .${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                  {
                    borderColor: 'inherit !important',
                  },
              }}
            />
          ) : (
            data.home.name
          )}
        </Typography>
      </Tooltip>
      <AvatarGroup max={3}>
        {data.home.users.map((user) => (
          <Tooltip key={user.id} title={user.name}>
            <Avatar alt={user.name} src={user.picture} />
          </Tooltip>
        ))}
      </AvatarGroup>
    </>
  ) : null;

  async function handleRenameHome() {
    const newName = nameValue?.trim();
    if (newName && newName !== data?.home?.name) {
      try {
        await renameHome({ variables: { newName } });
        enqueueSnackbar(t('rename-success', { newName }), {
          variant: 'success',
        });
      } catch (err) {
        enqueueSnackbar(t('rename-error'), { variant: 'error' });
      }
    }
    setNameValue(undefined);
  }
};

export default HomeData;
