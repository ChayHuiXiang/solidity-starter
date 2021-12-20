import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

const ContributeForm = (props) => {
  const [inputContribution, setInputContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
    const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setErrorMessage("");
    try {
      const campaign = Campaign(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(inputContribution,'ether'),
      });
      router.reload();
    } catch (error) {
        setErrorMessage(error.message);
    }
    setIsSending(false);
  };

  const contributionHandler = (event) => {
    setInputContribution(event.target.value);
  };

  return (
    <>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            labelPosition="right"
            label="ether"
            value={inputContribution}
            onChange={contributionHandler}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button loading={isSending} primary type="submit">
          Contribute!
        </Button>
      </Form>
    </>
  );
};

export default ContributeForm;
