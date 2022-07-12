import { useEffect, useState } from "react";
import { client, contract, CONTRACT_ADDRESS } from "../vite";
import * as vite from "@vite/vitejs"

export type Log = {
    vmlog: {
        topics: string[];
        data: string;
    };
    accountBlockHash: string;
    accountBlockHeight: string;
    address: string;
    removed: boolean;
};

export type DataLog<T> = {
    data: T;
    log: Log;
};

export function useVmLogs<T>(
    abi: any,
    eventName: string,
    topics: string[][]
): DataLog<T>[] {
    const [logs, setLogs] = useState<DataLog<T>[]>([]);

    useEffect(() => {
        let cancel = false
        const fragment = abi.find(
            (fragment) =>
                !fragment.anonymous &&
                fragment.name === eventName &&
                fragment.type === "event"
        );
        if (!fragment) return console.warn(`unknown fragment: ${eventName}`);

        const load = async () => {
            const logs = await client.methods.ledger.getVmLogsByFilter({
                [CONTRACT_ADDRESS]: {
                    startHeight: 1,
                    endHeight: 0
                }
            }, [
                [vite.abi.encodeLogSignature(fragment)],
                ...topics
            ])

            if (!logs?.length) return;

            const ret: DataLog<T>[] = [];

            for (let i = logs.length - 1; i >= 0; i--) {
                const log: Log = logs[i];
                const { vmlog } = log;

                const data = contract.events[eventName].decodeLog(
                    vmlog.topics,
                    vmlog.data
                ) as T;

                ret.push({
                    data,
                    log,
                });
            }

            setLogs(ret);
        };

        const subscribe = async () => {
            try {
                const event = await client.subscribe(
                    "createVmlogSubscription",
                    {
                        [CONTRACT_ADDRESS]: {
                            startHeight: "1",
                            endHeight: "0"
                        }
                    }
                );
                event.on("data", () => {
                    if(cancel)return
                    
                    load();
                });
            } catch (e) {
                console.warn(e);
            }
        };

        load();
        subscribe();
        return () => {
            cancel = true
        }
    }, [abi, eventName]);

    return logs;
}
