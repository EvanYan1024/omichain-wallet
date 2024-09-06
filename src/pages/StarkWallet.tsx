
import { connect, disconnect, useStarknetkitConnectModal } from 'starknetkit'
import { shortString, Contract, typedData, hash } from "starknet";
import ArgentAccountABI from '../ArgentAccount.json';
import { useState } from 'react';
import { Button, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Textarea, useDisclosure } from '@chakra-ui/react';
import { fetchToken } from '../utils/fetchToken';

import { useConnect, Connector, useAccount, useNetwork } from "@starknet-react/core";

import casmData from './data/cairo1_HelloCairo.compiled_contract_class.json';
import sierraData from './data/cairo1_HelloCairo.contract_class.json';


const typedDataValidate = {
  types: {
    StarkNetDomain: [
      { name: "name", type: "string" },
      { name: "version", type: "felt" },
      { name: "chainId", type: "felt" },
    ],
    Validate: [
      { name: "id", type: "felt" },
      { name: "from", type: "felt" },
    ]
  },
  primaryType: "Validate",
  domain: {
    name: "myDapp", // put the name of your dapp to ensure that the signatures will not be used by other DAPP
    version: "1",
    chainId: shortString.encodeShortString("SN_MAIN"), // shortString of 'SN_GOERLI' (or 'SN_MAIN'), to be sure that signature can't be used by other network.
  },
  message: {
    id: "0x0000004f000f",
    from: "0x2c94f628d125cd0e86eaefea735ba24c262b9a441728f63e5776661829a4066",
  },
};

export default function ConnectModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  return (
    <div className="w-full flex justify-end">
      <Button variant="ghost" onClick={onOpen}>{address || 'Connect Wallet'}</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col gap-4">
              {connectors.map((connector: Connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  disabled={!connector.available()}
                >
                  Connect {connector.name}
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}


export const StarkWallet = () => {
  const [connection, setConnection] = useState<any>(null);
  const network = useNetwork();
  const { account } = useAccount();
  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any
  })

  const [sierra, setSierra] = useState(JSON.stringify(sierraData));

  const [casm, setCasm] = useState(JSON.stringify(casmData));

  const connectStark = async () => {
    const connection = await connect();

    if (connection && connection.isConnected) {
      console.log(connection, 'connection')
      setConnection(connection)
      const signature2 = await connection.account.signMessage(typedDataValidate);
      console.log(signature2, 'signature2');
      const accountAddress = connection.account.address;
      const provider = connection.provider;
      const contractAccount = new Contract(ArgentAccountABI.abi, accountAddress, provider);

      const msgHash5 = typedData.getMessageHash(typedDataValidate, accountAddress);
      // The call of isValidSignature will generate an error if not valid
      let result5: boolean;
      try {
        await contractAccount.isValidSignature(msgHash5, signature2);
        result5 = true;
      } catch (err) {
        console.log(err);
        result5 = false;
      }
      console.log("Result5 (boolean) =", result5);
      // setProvider(connection.account)
      // setAddress(connection.selectedAddress)
    }
  }

  const fetchToken1 = async () => {
    //0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49
    // 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
    // 
    const token = await fetchToken('0x1c94c8f659e01b704bac76d907dd6fa253d52515f720afbdfdf383ec4d78817');
    console.log(token);
  }

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal()
    await connect({ connector })
  }

  const onDeclare = async () => {
    try {
      const data = JSON.parse(sierra);
      const classHash = hash.computeContractClassHash(data)
      const compiledClassHash = hash.computeCompiledClassHash(JSON.parse(casm))
      const res = await account?.declare({
        contract: data,
        classHash: classHash,
        compiledClassHash: compiledClassHash,
      });
      console.log(res, 'res');
    } catch (e) {
      console.error(e);
    }
  }

  console.log(network, 'network')

  return (
    <div>
      <div className='flex justify-end'>
        <Button onClick={connectWallet}>{account ? account.address : 'Connect Wallet'}</Button>
      </div>
      <div className='p-6 space-y-6'>

        {/* <button onClick={connectStark}>{connection ? connection.selectedAddress : 'Connect Stark Wallet'}</button> */}
        {/* <Button onClick={fetchToken1}>Fetch Token</Button> */}
        {/* <ConnectModal /> */}
        <div>
          <FormLabel>Contract Sierra</FormLabel>
          <Textarea placeholder="Enter your contract sierra here" value={sierra} onChange={e => setSierra(e.target.value)} />
        </div>
        <div>
          <FormLabel>Contract Casm</FormLabel>
          <Textarea placeholder="Enter your contract casm here" value={casm} onChange={e => setCasm(e.target.value)} />
        </div>
        <Button onClick={onDeclare}>declare</Button>
      </div>
    </div>
  )
}