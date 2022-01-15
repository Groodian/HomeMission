import {GetStaticProps, NextPage} from "next";
import Navbar from "../components/Navbar";
import Leftbar from "../components/Leftbar";
import React from "react";
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const StatisticPage: NextPage = () => {
  return (
    <Container>
      <Typography>STATISTIC PAGE</Typography>
    </Container>
  );
};

export default StatisticPage;
