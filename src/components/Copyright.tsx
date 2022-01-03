import Typography from '@mui/material/Typography';
import { Trans, useTranslation } from 'next-i18next';
import React from 'react';
import Link from './Link';

const Copyright: React.FC = () => {
  const { t } = useTranslation('Copyright');
  const year = new Date().getFullYear();

  return (
    <Typography variant="body2" color="text.secondary" align="center">
      <Trans i18nKey="copyright" t={t} year={year}>
        Copyright ©{' '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {{ year }}.
      </Trans>
    </Typography>
  );
};

export default Copyright;
