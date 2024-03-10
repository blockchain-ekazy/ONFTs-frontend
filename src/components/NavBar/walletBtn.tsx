import { useDispatch, useSelector } from "react-redux";
import { NormalButton } from "../../theme/components";
import { connectWallet, disConnectWallet } from "../../controllers/wallet";
import { useState } from "react";

export const WalletButton = () => {
    const walletState = useSelector((state: any) => state.wallet);
    const dispatch = useDispatch();
    const [connectedAddress, setConnectedAddress] = useState<string>('');

    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    const onClickWalletBtn = async () => {
        if (walletState.isConnected) {
            disConnectWallet(dispatch);
            setConnectedAddress('');
        } else {
            const address = await connectWallet(dispatch);
            if (address) {
                setConnectedAddress(address);
            }
        }
    };

    return (
        <NormalButton onClick={onClickWalletBtn}>
            {walletState.isConnected ? `Wallet Connected ${formatAddress(connectedAddress)}` : "Connect Wallet"}
        </NormalButton>
    );
};
