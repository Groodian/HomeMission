import React from 'react';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';

const ReadOnlyCopyTextField: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'InviteDialog' });
  const { enqueueSnackbar } = useSnackbar();

  const endAdornment = (
    <InputAdornment position="end">
      <Tooltip title={t('copy-tooltip', { label }) as string} placement="right">
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(value || '');
            enqueueSnackbar(t('copy-info', { label }), {
              variant: 'info',
            });
          }}
          edge="end"
        >
          <ContentCopy />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );

  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      margin="dense"
      InputProps={{
        readOnly: true,
        endAdornment,
      }}
    />
  );
};

export default ReadOnlyCopyTextField;
