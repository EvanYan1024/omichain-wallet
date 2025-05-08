import {
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  useToast,
  VStack,
  Box,
  Heading,
  Divider,
  Text,
  HStack,
  Select,
} from "@chakra-ui/react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, Connection, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { percentAmount, generateSigner, some } from "@metaplex-foundation/umi";
import {
  createFungible,
  mintV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { getExplorerLink } from "../utils/common";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import bs58 from "bs58";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const clusterApiUrl = (cluster?: Cluster) => {
  if (cluster === "devnet") {
    return "https://api.devnet.solana.com";
  }
  return "https://nameless-quaint-waterfall.solana-mainnet.quiknode.pro/162133a9db1841a2bc0e561c16bd4dde5d59915e/";
};

// 定义本地存储中保存的 Token 信息类型
interface SavedToken {
  mintAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  createdAt: number;
  network: string; // 添加网络信息
}

// 定义网络类型
type NetworkType = "devnet" | "mainnet-beta";

export default function SolanaToken() {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const toast = useToast();
  const anchorWallet = useAnchorWallet();

  // 添加网络选择状态
  const [network, setNetwork] = useState<NetworkType>("devnet");

  // Token 基本信息
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [loading, setLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);

  // Metadata 信息
  const [tokenUri, setTokenUri] = useState("");
  const [description, setDescription] = useState("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState(0);

  // 保存的 Token 列表
  const [savedTokens, setSavedTokens] = useState<SavedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [mintAmount, setMintAmount] = useState<number>(1);

  // 加载保存的 Token 列表
  useEffect(() => {
    const loadSavedTokens = () => {
      const tokensJson = localStorage.getItem("solana-tokens");
      if (tokensJson) {
        try {
          const tokens = JSON.parse(tokensJson) as SavedToken[];
          setSavedTokens(tokens);
        } catch (error) {
          console.error("解析保存的 Token 失败:", error);
        }
      }
    };

    loadSavedTokens();
  }, []);

  // 根据当前选择的网络过滤 Token 列表
  const filteredTokens = savedTokens.filter(
    (token) => !token.network || token.network === network
  );

  const handleCreateToken = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "请先连接钱包",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!tokenName || !tokenSymbol) {
      toast({
        title: "请填写必要信息",
        description: "Token 名称和符号是必填项",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      // 创建 UMI 实例，使用选定的网络
      const umi = createUmi(clusterApiUrl(network)).use(mplTokenMetadata());

      // 从钱包创建签名者
      // const walletAdapter = createSignerFromWallet(umi, wallet);
      umi.use(walletAdapterIdentity(wallet));

      // 生成 mint 签名者
      const mint = generateSigner(umi);

      // 默认 URI，如果用户没有提供
      const defaultUri =
        tokenUri ||
        "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

      // 创建 Token
      const { signature } = await createFungible(umi, {
        mint: mint,
        name: tokenName,
        symbol: tokenSymbol,
        uri: defaultUri,
        sellerFeeBasisPoints: percentAmount(royaltyPercentage),
        decimals: some(decimals),
      }).sendAndConfirm(umi);
      const signatureBase58 = bs58.encode(signature);
      // 获取交易链接
      const transactionLink = getExplorerLink(
        "transaction",
        signatureBase58,
        network
      );

      console.log(`✅ Token 创建成功，交易链接: ${transactionLink}`);
      console.log(`✅ Mint 地址: ${mint.publicKey}`);

      // 保存 Token 信息到本地存储，包含网络信息
      const newToken: SavedToken = {
        mintAddress: mint.publicKey.toString(),
        name: tokenName,
        symbol: tokenSymbol,
        decimals: decimals,
        createdAt: Date.now(),
        network: network, // 保存当前网络
      };

      const existingTokensJson = localStorage.getItem("solana-tokens");
      const existingTokens = existingTokensJson
        ? (JSON.parse(existingTokensJson) as SavedToken[])
        : [];

      const updatedTokens = [newToken, ...existingTokens];
      localStorage.setItem("solana-tokens", JSON.stringify(updatedTokens));

      // 更新状态
      setSavedTokens(updatedTokens);
      setSelectedToken(mint.publicKey.toString());

      toast({
        title: "Token 创建成功",
        description: (
          <Box>
            <p>Mint 地址: {mint.publicKey.toString()}</p>
            <p>网络: {network}</p>
            <p>Token 已保存到本地存储</p>
            <a
              href={transactionLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              查看交易
            </a>
          </Box>
        ),
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    } catch (error) {
      console.error("创建 Token 失败:", error);
      toast({
        title: "创建 Token 失败",
        description: error instanceof Error ? error.message : "未知错误",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 铸造 Token 到自己的钱包
  const handleMintToken = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "请先连接钱包",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!selectedToken) {
      toast({
        title: "请选择 Token",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (mintAmount <= 0) {
      toast({
        title: "铸造数量必须大于 0",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setMintLoading(true);

      // 创建 UMI 实例，使用选定的网络
      const umi = createUmi(clusterApiUrl(network)).use(mplTokenMetadata());
      umi.use(walletAdapterIdentity(wallet));

      // 获取选中的 Token 信息
      const token = savedTokens.find((t) => t.mintAddress === selectedToken);
      if (!token) {
        throw new Error("未找到选中的 Token 信息");
      }

      // 创建 Mint 公钥
      const mintPublicKey = new PublicKey(token.mintAddress);
      const mintUmiPublicKey = new PublicKey(mintPublicKey.toBytes());

      // 找到关联的 Token 账户
      const associatedToken = findAssociatedTokenPda(umi, {
        mint: mintUmiPublicKey,
        owner: umi.identity.publicKey,
      });

      // 计算铸造数量（考虑小数位数）
      const amount = mintAmount * 10 ** token.decimals;

      // 铸造 Token
      const { signature } = await mintV1(umi, {
        mint: mintUmiPublicKey,
        authority: umi.identity,
        amount: BigInt(amount),
        tokenOwner: umi.identity.publicKey,
        tokenStandard: { fungible: {} },
      }).sendAndConfirm(umi);

      const signatureBase58 = bs58.encode(signature);
      // 获取交易链接
      const transactionLink = getExplorerLink(
        "transaction",
        signatureBase58,
        network
      );

      console.log(`✅ Token 铸造成功，交易链接: ${transactionLink}`);

      toast({
        title: "Token 铸造成功",
        description: (
          <Box>
            <p>
              已铸造 {mintAmount} 个 {token.symbol} 到您的钱包
            </p>
            <p>网络: {network}</p>
            <a
              href={transactionLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              查看交易
            </a>
          </Box>
        ),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("铸造 Token 失败:", error);
      toast({
        title: "铸造 Token 失败",
        description: error instanceof Error ? error.message : "未知错误",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setMintLoading(false);
    }
  };

  // 处理网络变更
  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value as NetworkType;
    setNetwork(newNetwork);
    // 当网络变更时，清空选中的 Token
    setSelectedToken("");
  };

  return (
    <VStack
      spacing={6}
      className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow"
    >
      <WalletMultiButton />
      <Heading as="h1" size="xl">
        创建 Solana Token
      </Heading>

      {/* 添加网络选择下拉框 */}
      <FormControl>
        <FormLabel>网络</FormLabel>
        <Select value={network} onChange={handleNetworkChange}>
          <option value="devnet">Devnet</option>
          <option value="mainnet-beta">Mainnet</option>
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Token 名称</FormLabel>
        <Input
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          placeholder="输入 Token 名称"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Token 符号</FormLabel>
        <Input
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          placeholder="输入 Token 符号"
        />
      </FormControl>

      <FormControl>
        <FormLabel>小数位数</FormLabel>
        <NumberInput value={decimals} min={0} max={9}>
          <NumberInputField
            onChange={(e) => setDecimals(parseInt(e.target.value) || 0)}
          />
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel>Metadata URI (可选)</FormLabel>
        <Input
          value={tokenUri}
          onChange={(e) => setTokenUri(e.target.value)}
          placeholder="输入 Metadata JSON URI"
        />
      </FormControl>

      <FormControl>
        <FormLabel>描述 (可选)</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入 Token 描述"
        />
      </FormControl>

      <FormControl>
        <FormLabel>版税百分比 (%)</FormLabel>
        <NumberInput value={royaltyPercentage} min={0} max={100} precision={2}>
          <NumberInputField
            onChange={(e) =>
              setRoyaltyPercentage(parseFloat(e.target.value) || 0)
            }
          />
        </NumberInput>
      </FormControl>

      <Button
        colorScheme="blue"
        width="full"
        onClick={handleCreateToken}
        isLoading={loading}
        loadingText="创建中"
        disabled={!connected}
      >
        {connected ? "创建 Token" : "请先连接钱包"}
      </Button>

      {/* 铸造 Token 部分 */}
      {filteredTokens.length > 0 && (
        <>
          <Divider my={4} />
          <Heading as="h2" size="lg">
            铸造 Token
          </Heading>

          <FormControl>
            <FormLabel>选择 Token</FormLabel>
            <Select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              placeholder="选择要铸造的 Token"
            >
              {filteredTokens.map((token) => (
                <option key={token.mintAddress} value={token.mintAddress}>
                  {token.name} ({token.symbol})
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>铸造数量</FormLabel>
            <NumberInput value={mintAmount} min={0.000001} precision={6}>
              <NumberInputField
                onChange={(e) => setMintAmount(parseFloat(e.target.value) || 0)}
              />
            </NumberInput>
          </FormControl>

          <Button
            colorScheme="green"
            width="full"
            onClick={handleMintToken}
            isLoading={mintLoading}
            loadingText="铸造中"
            disabled={!connected || !selectedToken}
          >
            铸造 Token 到我的钱包
          </Button>
        </>
      )}

      {/* 已保存的 Token 列表 */}
      {filteredTokens.length > 0 && (
        <>
          <Divider my={4} />
          <Heading as="h2" size="lg">
            我的 Token 列表 ({network})
          </Heading>

          <VStack spacing={3} width="full" align="stretch">
            {filteredTokens.map((token) => (
              <Box
                key={token.mintAddress}
                p={3}
                borderWidth={1}
                borderRadius="md"
                borderColor="gray.200"
              >
                <Text fontWeight="bold">
                  {token.name} ({token.symbol})
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Mint: {token.mintAddress}
                </Text>
                <Text fontSize="sm">小数位数: {token.decimals}</Text>
                <Text fontSize="sm">网络: {token.network || "devnet"}</Text>
                <Text fontSize="sm">
                  创建时间: {new Date(token.createdAt).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
        </>
      )}
    </VStack>
  );
}
