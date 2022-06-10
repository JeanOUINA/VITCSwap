/** @jsx jsx */
import { jsx } from "@emotion/react"
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { useRef, useState } from "react";
import AddLiquidity from "../../components/AddLiquidity";
import CreatePair from "../../components/CreatePair";
import RemoveLiquidity from "../../components/RemoveLiquidity";
import Swap from "../../components/Swap";
import useMobile from "../../hooks/useMobile";

export default function Home(){
    const [tab, setTab] = useState(0)
    // const chartRef = useRef()
    // const isMobile = useMobile()
    return <div css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: 20,
        paddingBottom: 100
    }}>
        <div css={{
            display: "flex",
            flexDirection: "row",
            gap: 100
        }}>
            {/*tab === 0 && !isMobile && <Paper css={{
                padding: 10,
                width: 800
            }} elevation={2} ref={chartRef}>
                
            </Paper>*/}

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
                {tab === 0 && <Swap /> /*chartRef={chartRef}*/}
                {tab === 1 && <AddLiquidity/>}
                {tab === 2 && <RemoveLiquidity/>}
                {tab === 3 && <CreatePair/>}
            </Paper>
        </div>
    </div>
}