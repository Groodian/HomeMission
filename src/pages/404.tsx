import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Custom404: NextPage = () => {
  const { t } = useTranslation('404');

  return (
    <Box textAlign="center" width={300} mx="auto">
      <Typography variant="h3">404</Typography>
      <Divider />
      <Typography variant="h5">{t('not-found')}</Typography>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['404', 'common'])),
    },
  };
};

export default Custom404;
