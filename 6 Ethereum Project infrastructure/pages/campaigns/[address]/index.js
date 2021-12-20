import React from "react";
import web3 from "../../../ethereum/web3";
import Layout from "../../../components/Layout";
import factory from "../../../ethereum/factory";
import Campaign from "../../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import Link from "next/link";
import ContributeForm from "../../../components/ContributeForm";

const CampaignShow = (props) => {
  const items = [
    {
      header: props.manager,
      meta: "Address of Manager",
      description:
        "The manager created this campaign and can create requests to withdraw money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: props.minimumContribution,
      meta: "Minimum Contribution (wei)",
      description:
        "You must contribute at least this much wei to become an approver",
    },
    {
      header: props.requestsCount,
      meta: "Number of Requests",
      description:
        "A request tries to withdraw money from the contract. Requests must be approved by approvers",
    },
    {
      header: props.approversCount,
      meta: "Number of Approvers",
      description: "Number of people who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(props.balance, "ether"),
      meta: "Campaign Balance (ether)",
      description:
        "The balance is how much money this campaign has left to spend",
    },
  ];

  return (
    <Layout>
      <h3>Campaign show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={props.address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${props.address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export const getStaticProps = async ({ params }) => {
  const address = params.address;
  const campaign = Campaign(address);
  const summary = await campaign.methods.getSummary().call();
  return {
    props: {
      minimumContribution: summary["0"],
      balance: summary["1"],
      requestsCount: summary["2"],
      approversCount: summary["3"],
      manager: summary["4"],
      address,
    },
  };
};

export const getStaticPaths = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  const paths = campaigns.map((address) => ({
    params: { address },
  }));
  return {
    paths,
    fallback: false,
  };
};

export default CampaignShow;
