import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

const RequestRow = (props) => {
  const { Cell, Row } = Table;
  const approveHandler = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(props.address);
      await campaign.methods.approveCampaign(props.id).send({
        from: accounts[0],
      });
    } catch (error) {}
  };
  const finalizeHandler = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(props.address);
      await campaign.methods.finalizeCampaign(props.id).send({
        from: accounts[0],
      });
    } catch (error) {}
  };
  return (
    <Row disabled={props.request.complete} positive={(props.request.approvalCount > props.approversCount/2) && !props.request.complete}>
      <Cell>{props.id}</Cell>
      <Cell>{props.request.description}</Cell>
      <Cell>{web3.utils.fromWei(props.request.value, "ether")}</Cell>
      <Cell>{props.request.recipient}</Cell>
      <Cell>{`${props.request.approvalCount}/${props.approversCount}`}</Cell>
      <Cell>
        {!props.request.complete && <Button color="green" basic onClick={approveHandler}>
          Approve
        </Button>}
      </Cell>
      <Cell>
        {!props.request.complete && <Button color="red" basic onClick={finalizeHandler}>
          Finalize
        </Button>}
      </Cell>
    </Row>
  );
};

export default RequestRow;
