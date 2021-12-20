import React, {useState} from "react";
import Layout from "../../../../components/Layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import { useRouter } from "next/router";
import Link from "next/link";

const RequestNew = () => {
    const [isSending, setIsSending] = useState(false);
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [recipient, setRecipient] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    const descriptionHandler = (event) => {
        setDescription(event.target.value);
    }
    const valueHandler = (event) => {
        setValue(event.target.value);
    }
    const recipientHandler = (event) => {
        setRecipient(event.target.value);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsSending(true);
        setErrorMessage('');
        try {
            const campaign = Campaign(router.query.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value,'ether'),
                recipient
            ).send({
                from: accounts[0],
            });
            router.push(`/campaigns/${router.query.address}/requests/`)
        } catch (error) {
            setErrorMessage(error.message);
        }
        setIsSending(false);

    }

  return (
    <Layout>
    <Link href={`/campaigns/${router.query.address}/requests/`}>Back</Link>
    <h3>Create a Request</h3>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={descriptionHandler}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            labelPosition="right"
            label="ether"
            value={value}
            onChange={valueHandler}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={recipientHandler}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button loading={isSending} primary type="submit">
          Create!
        </Button>
      </Form>
    </Layout>
  );
};



export default RequestNew;
