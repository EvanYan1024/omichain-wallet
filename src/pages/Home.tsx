import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import {
  useAuthCore,
  useConnect,
  useEthereum,
} from "@particle-network/authkit";
import { mainnet } from "@particle-network/authkit/chains";
import { AuthType, UserInfo } from "@particle-network/auth-core";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";
import { TmaWalletApp } from "./TmaWallet";
import Game from "./Game";
import { checksumAddress, getAddress } from "viem";
import DraggableCards from "../components/DraggableCards";

export default function Home() {
  // const { connect, disconnect, connectionStatus, setSocialConnectCallback } = useConnect();
  // const { address, provider, chainInfo, signMessage } = useEthereum();
  // const { userInfo } = useAuthCore();

  // useEffect(() => {
  //     setSocialConnectCallback({
  //         onError: (error: any) => {
  //             console.log('SocialConnectCallback onError', error);
  //         },
  //         onSuccess: (info: UserInfo) => {
  //             console.log('SocialConnectCallback onSuccess', info);
  //         },
  //     });
  //     return () => {
  //         setSocialConnectCallback(undefined);
  //     };
  // }, []);
  const sdk = new CoinbaseWalletSDK({
    appName: "My App Name",
    appChainIds: [8453],
  });

  const connectCb = async () => {
    const provider = sdk.makeWeb3Provider({ options: "all" });
    // Use provider
    const addresses = await provider.request({ method: "eth_requestAccounts" });
    console.log(addresses);
  };

  // useEffect(() => {
  //     var term = new Terminal();
  //     term.open(document.getElementById('terminal'));
  //     term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
  // }, [])

  const isValid = (address: any) => {
    console.log(checksumAddress(address as `0x${string}`));
    getAddress(address);
    return checksumAddress(address as `0x${string}`) === address;
  };

  console.log(isValid("0xaf8c1e4488602dfb3807bd1d36dc2151c7651497"));

  const connectSocial = async (type: string) => {
    // await connect({
    //     socialType: type,
    //     chain: mainnet,
    //     authorization: {
    //         uniq: true
    //     }
    // });
  };

  function openNewWindow(url: string) {
    const newWindow = window.open(url, "test", "width=500,height=500");
    if (newWindow) {
      // 监听来自新窗口的消息
      window.addEventListener("message", (event) => {
        console.log("Received message:", event.data);
      });
    } else {
      console.error("Failed to open new window.");
    }
  }

  const img =
    "data:image/png;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyALQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iisfxB4lsPDdtDJd+bLNcSCK3tbdd80zEgYVcjOMj8wOpAIBsUVwz+ONesbWO/1XwTe2+nFd8ksFys0ka7S2WjwCo453Yx354rsNP1C01WwhvrGdJ7aZd0cidCP6EdCDyCMGgDkp/FOt614ivtK8J2+nsmm/JeXOo7wpkJICIF542tzjBwenBa54Y8U3OoarfeH9at4rfXLH55Bb5MMsZxh1JyRwy8HnkH1C4PwU/5E28/7CD/+i46fq00kfx20JI5HVZdNZJArEB1/fHB9RkA/UCgDs9Z1/SfD9sJ9VvorZG+6GOWfkA7VGS2MjOAcZqno3jTw7r9ybbTdUilnHSJlaNm4J+UOAWwAScZx3rSutKsL68tbu6tIp57XPkPIu7yySpJAPAOUXnqMcdTXnXxcitJ5tEisSg8SvdItsY32SiMkgfNkADftwSeDux/FQB6jXDJ8K9BmtZDqst7qWoyriS/nuG8wNtC5UZxgYyA27HQkiu5rhvHPi+S0ceGtCje61+9Xy1WJiDbqw+8SCMNjkcjA+Y4GMgEPw11TVJrrxBompXz3w0m68qK5lz5jgtIDkknI+TIzkjJGcYx39YPg/wANQ+FfDsGnx8zH97cvuLB5SAGIyBxwAOBwBnnJreoAKKKKACiiigAooooAKKKKACiiigAooooAK4P4nW9lBZ6Zr09/9lutLuDJaI0JkSeTG8RsFwRkxj5s4HPqMd5XAfErS9UmuvD+t6bYvfDSbrzZbaLPmOC0ZGAAcj5MHGSMg4xnABm6/wCKvFL+F401Xw4ml2N6q295fvJ5wijkXazeSpDoecgMTg/Kck123hDTbTSfCWmWljcvdWwhEkc7rtMgcl92OwO7gHkDg5rkte+I+jaz4audP0VLvUNT1C3aBLOO3fem9DuJ4wdoz93OcenI6fwNo93oPg3TtNvgi3MSuZFRtwUs7NjPqN2DjjPQnrQBzGlw3/w51XULJNJ1DUtCvZDc2Z06HzWt26FHB56bRktztBHJbF/w3p2o614xuvF+qWb2cAhNpp1pdRATRoDy54+Un5+OT85GcAFu5ooAwfFfiuw8JaUbu7O+Z8rb2ynDTN/QDjJ7e5IBwfBnh7VrnVZPF3idv+JncR7La1KYFrGfQHlTjIwOQC27JY46TXfC2jeJfs/9r2f2n7Pu8r966bd2M/dIz90dfSsf/hVvg3/oDf8Ak1N/8XQB2Feb6T8NNZ0O8ubyw8X7Lq5/108mmpK785PzOxPJ5PrgZ6CvSKKAMfQtO1mw+0f2vr39q79vlf6GkHl4zn7p5zkdemPetiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//";

  return (
    <div className="mt-6">
      <DraggableCards />
      <img src={img} alt="" />
      <Button onClick={() => openNewWindow(`${window.location.href}404`)}>
        点击打开新窗口
      </Button>
      {/* <h1>Home</h1>
            <Button onClick={connectCb}>Connect Coinbase</Button>

            <div className="space-y-6">
                <Button onClick={() => connectSocial(AuthType.google)}>Connect Google</Button>
                <Button onClick={() => connectSocial(AuthType.twitter)}>Connect Twitter</Button>
            </div> */}

      {/* <div id="terminal" className="w-full"></div> */}
      {/* <BackgroundGradientAnimation containerClassName="w-[1500px] h-[500px]">
                <img src="./norvos.png" alt="" className="absolute left-5 top-5 h-12" />
                <div className="absolute w-full z-50 inset-0 flex items-center justify-center text-white font-bold pointer-events-none text-xl text-center md:text-4xl lg:text-5xl">

                    <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
                        Building the Future
                        of OnChain Gaming
                    </p>
                </div>
            </BackgroundGradientAnimation> */}
      {/* <TmaWalletApp /> */}
    </div>
  );
}
