import {GetStaticProps, NextPage} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const StatisticPage: NextPage = () => {
  const { t } = useTranslation('statistic');

  return (
    <h1>Aloo</h1>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', [
        '_app',
        'roommates',
        'common',
      ])),
    },
  };
};


export default StatisticPage;
