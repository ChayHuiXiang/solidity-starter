import React from "react";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import factory from "../../../../ethereum/factory";
import RequestRow from "../../../../components/RequestRow";

const RequestIndex = (props) => {
  const router = useRouter();
  const { Header, Row, HeaderCell, Body } = Table;
  const headerList = [
    "ID",
    "Description",
    "Amount",
    "Recipient",
    "Approval Count",
    "Approve",
    "Finalize",
  ];
  const requests = JSON.parse(props.requests);
  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`${router.asPath}/new`}>
        <Button primary floated="right" style={{marginBottom:10}}>Add request</Button>
      </Link>
      <Table>
        <Header>
          <Row>
            {headerList.map((header, index) => {
              return <HeaderCell key={index}>{header}</HeaderCell>;
            })}
          </Row>
        </Header>
        <Body>
          {requests.map((request, index) => {
            return (
              <RequestRow
                request={request}
                key={index}
                id={index}
                address={router.query.address}
                approversCount={props.approversCount}
              />
            );
          })}
        </Body>
      </Table>
      <div>Found {props.requestCount} requests.</div>
    </Layout>
  );
};

export const getStaticProps = async ({ params }) => {
  const address = params.address;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  return { props: { requests: JSON.stringify(requests), approversCount, requestCount } };
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

export default RequestIndex;
