import React from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";

const CampaignIndex = (props) => {
  const items = props.campaigns.map((address) => {
    return {
      header: address,
      description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
      fluid: true,
    };
  });
  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link href="/campaigns/new"><Button floated="right" content="Create Campaign" icon="add" primary /></Link>
        <Card.Group items={items} />
      </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return {
    props: {
      campaigns,
    },
  };
};

export default CampaignIndex;
