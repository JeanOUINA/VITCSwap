/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import { Alert, Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import AddLiquidity from "../../components/AddLiquidity";
import CreatePair from "../../components/CreatePair";
import RemoveLiquidity from "../../components/RemoveLiquidity";
import Swap from "../../components/Swap";
import { useChartDisabled } from "../../hooks/useChartDisabled";
import { closeLayer, pushLayer } from "../../layers";
import Modal from "../../layers/Modal";
import EULAStore from "../../stores/EULAStore";

export default function Home(){
    const [tab, setTab] = useState(0)
    const chartRef = useRef()
    const chartDisabled = useChartDisabled()
    useEffect(() => {
        const eulaAccept = EULAStore.getAccept()
        if(!eulaAccept){
            pushLayer(<Modal key="layer-eula" close={() => {}}>
                <Typography variant="h5">Disclaimer</Typography>
                <Alert css={{
                    marginBottom: 10,
                    marginTop: 10
                }} severity="warning">Please read the following before using VITCSwap.</Alert>
                <Typography css={{
                    maxWidth: 600
                }} variant="body2">
                    VITCSwap is an open source decentralized application operating on the Vite blockchain. As with all early-stage products there are risks associated with using the protocol and users assume the full responsibility for these risks. You should not deposit any money you are not comfortable losing.
                </Typography>
                <div css={{
                    display: "flex",
                    gap: 10
                }}>
                    <div css={{flexGrow: 1}}></div>
                    <Button onClick={() => {
                        window.location = "https://vitamincoin.org" as any
                    }}>
                        Disagree
                    </Button>
                    <Button onClick={() => {
                        EULAStore.setAccept(true)
                        closeLayer("layer-eula")
                    }}>
                        Agree
                    </Button>
                </div>
            </Modal>)
        }
    }, [])
    return <div css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: 20,
        paddingBottom: 50
    }}>
        <div css={{
            display: "flex",
            flexDirection: "row",
            gap: 100
        }}>
            {tab === 0 && <Paper css={{
                padding: 10,
                width: 800,
                display: chartDisabled ? "none" : "initial"
            }} elevation={2} ref={chartRef} />}

            <Paper css={{
                padding: 10,
                width: 400
            }} elevation={2}>
                <Box sx={{
                    borderBottom: 1, 
                    borderColor: "divider", 
                    marginBottom: 2 
                }}>
                    <ButtonGroup>
                        <Button onClick={() => setTab(0)}>Swap</Button>
                        <Button onClick={() => setTab(1)}>Add Liquidity</Button>
                        <Button onClick={() => setTab(2)}>Remove Liquidity</Button>
                        <Button onClick={() => setTab(3)}>Create Pair</Button>
                    </ButtonGroup>
                </Box>
                {tab === 0 && <Swap chartRef={chartRef} />}
                {tab === 1 && <AddLiquidity/>}
                {tab === 2 && <RemoveLiquidity/>}
                {tab === 3 && <CreatePair/>}
            </Paper>
        </div>
    </div>
}