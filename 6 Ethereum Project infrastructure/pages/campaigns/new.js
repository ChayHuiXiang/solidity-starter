import React, {useState} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {useRouter} from 'next/router';

const CampaignNew = () => {
    const router = useRouter();

    const [inputMinimum, setInputMinimum] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const minimumHandler = (event) => {
        setInputMinimum(event.target.value);
    }
    const submitHandler = async (event) => {
        event.preventDefault();
        setIsSending(true);
        setErrorMessage('');
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(inputMinimum).send({
                from: accounts[0]
            });

            router.push('/');
        } catch (error) {
            setErrorMessage(error.message);
        }
        setIsSending(false);
    }

    return (
        <Layout>
            <h3>Create a campaign</h3>
            <Form onSubmit={submitHandler} error={!!errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input labelPosition='right' label="wei" value={inputMinimum} onChange={minimumHandler}/>
                </Form.Field>
                <Message error header="Oops!" content={errorMessage} />
                <Button loading={isSending} primary type="submit">Create!</Button>
            </Form>
        </Layout>
    );
};

export default CampaignNew;