import { watchChannel } from "../api/channels";

export function useWatchChannel() {
    return async (id: number) => {
        try {
            await watchChannel(id);
        } catch (err) {
            alert((err as Error).message);
        }
    };
}