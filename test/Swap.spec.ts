import { describe, before, it } from "mocha";
import { expect } from "chai";
const vuilder = require("@vite/vuilder");
import config from "./vite.config.json";

let provider: any;
let deployer: any;

describe("VITCSwap tests", () => {
    before(async function() {
        provider = vuilder.newProvider(config.networks.local.http);
        console.log(await provider.request("ledger_getSnapshotChainHeight"));
        deployer = vuilder.newAccount(config.networks.local.mnemonic, 0, provider);
        console.log("deployer", deployer.address);
    });

    describe("Swap.solpp", () => {
        let swap: any

        it("Should deploy Swap.solpp", async () => {
            // compile
            const compiledContracts = await vuilder.compile("Swap.solpp");
            expect(compiledContracts).to.have.property("VITCSwap");
    
            // deploy
            swap = compiledContracts.VITCSwap;
            swap.setDeployer(deployer).setProvider(provider);
            await swap.deploy({});
            expect(swap.address).to.be.a("string");
        })

        describe("SBP Voting", () => {
            it("Should not vote for any sbp", async () => {
                let sbpInfo = await provider.request(
                    "contract_getVotedSBP",
                    swap.address
                )
                expect(sbpInfo).to.be.equal(null)
            })
    
            it("Should vote for sbp s1", async () => {
                // call Cafe.depositVITE();
                await swap.call(
                    "VoteForSBP",
                    ["s1"],
                    {}
                );
                const sbpInfo = await provider.request(
                    "contract_getVotedSBP",
                    swap.address
                )
                expect(sbpInfo.blockProducerName).to.be.equal("s1")
            })
    
            it("Should cancel its SBP vote", async () => {
                await swap.call(
                    "cancelVote",
                    [],
                    {}
                );
                const sbpInfo = await provider.request(
                    "contract_getVotedSBP",
                    swap.address
                )
                expect(sbpInfo).to.be.equal(null)
            })
        })

        describe("VITE Balance", () => {
            it("Should not have any VITE balance", async () => {
                let result = await swap.query("getVITEBalance", [deployer.address]);
                expect(result)
                    .to.be.an("array")
                    .with.lengthOf(1);
                expect(result![0]).to.be.equal("0");
            })

            const depositedAmount = (BigInt(500)*BigInt(1e18)).toString()
            it("Should deposit 500 VITE to the contract", async () => {
                const block = await swap.call(
                    "depositVITE",
                    [],
                    {
                        amount: depositedAmount
                    }
                );
        
                const events = await swap.getPastEvents("VITEDeposit", {fromHeight: block.height, toHeight: block.height});
                expect(events)
                    .to.be.an("array")
                    .with.lengthOf(1);
                expect(events[0]?.returnValues?.addr).to.be.equal(deployer.address);
                expect(events[0]?.returnValues?.amount).to.be.equal(depositedAmount);
                expect(events[0]?.returnValues?.newBalance).to.be.equal(depositedAmount);
            })

            it("Should have a balance of 500 VITE", async () => {
                let result = await swap.query("getVITEBalance", [deployer.address]);
                expect(result)
                    .to.be.an("array")
                    .with.lengthOf(1);
                expect(result![0]).to.be.equal(depositedAmount);
            })

            const withdrawnBalance = (BigInt(100)*BigInt(1e18)).toString()
            it("Should withdraw 100 VITE from the contract", async () => {
                const block = await swap.call(
                    "withdrawVITE",
                    [withdrawnBalance],
                    {}
                );
        
                const events = await swap.getPastEvents("VITEWithdrawal", {fromHeight: block.height, toHeight: block.height});
                expect(events)
                    .to.be.an("array")
                    .with.lengthOf(1);
                expect(events[0]?.returnValues?.addr).to.be.equal(deployer.address);
                expect(events[0]?.returnValues?.amount).to.be.equal(withdrawnBalance);
                expect(events[0]?.returnValues?.newBalance).to.be.equal(
                    (BigInt(depositedAmount)-BigInt(withdrawnBalance))
                        .toString()
                );
            })

            it("Should have a balance of 400 VITE", async () => {
                let result = await swap.query("getVITEBalance", [deployer.address]);
                expect(result)
                    .to.be.an("array")
                    .with.lengthOf(1);
                expect(result![0]).to.be.equal(
                    (BigInt(depositedAmount)-BigInt(withdrawnBalance))
                        .toString()
                );
            })
        })

        describe("Pair", () => {
            let token: any
            it("Should create a token", async () => {
                // Mint a token
                const compiledContracts = await vuilder.compile("TokenIssuanceContract.solpp");
                expect(compiledContracts).to.have.property("TokenIssuanceContract");
        
                const tknIssuance = compiledContracts.TokenIssuanceContract;
                tknIssuance.setDeployer(deployer).setProvider(provider);
                tknIssuance.address = "vite_000000000000000000000000000000000000000595292d996d"

                // Mint a token
                const block = await tknIssuance.call(
                    "IssueToken",
                    [
                        false,
                        "Test Token",
                        "TEST",
                        (BigInt(1e9)*BigInt(1e18)).toString(),
                        "18",
                        "0",
                        false
                    ],
                    {}
                );
        
                const events = await swap.getPastEvents("issue", {fromHeight: block.height, toHeight: block.height});
                expect(events)
                    .to.be.an("array")
                    .with.lengthOf(1);
                expect(events[0]?.returnValues?.token).to.be.a("string");
                token = events[0].returnValues.token
            })
            describe("Pair creation", () => {
                it("Should create a pair", async () => {
                    const block = await swap.call(
                        "createNewPair",
                        [token],
                        {
                            amount: (100n*BigInt(1e18)).toString()
                        }
                    );
            
                    const events = await swap.getPastEvents("NewPair", {fromHeight: block.height, toHeight: block.height});
                    expect(events)
                        .to.be.an("array")
                        .with.lengthOf(1);
                    expect(events[0]?.returnValues?.token).to.be.a("string");
                })
            })
        })
    })
});