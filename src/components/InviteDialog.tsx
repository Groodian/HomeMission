import React from 'react';
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';
import ReadOnlyCopyTextField from './Inputs/ReadOnlyCopyTextField';

type InviteDialogProps = { open: boolean; onClose?: () => void };
const InviteDialog: React.FC<InviteDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation('common', { keyPrefix: 'InviteDialog' });
  const { data } = useHomeQuery();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="dialog-title">{t('invite-roommates')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <ReadOnlyCopyTextField
            label={t('invitation-code')}
            value={data?.home?.code}
          />
          <ReadOnlyCopyTextField
            label={t('invitation-link')}
            value={`${window.location.protocol}//${window.location.host}/join?code=${data?.home?.code}`}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
