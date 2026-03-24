"use client";
import Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import { client } from "@/lib/rpc";

const AppAblyProvider: FC<PropsWithChildren> = ({ children }) => {
	const [ablyClient, setAblyClient] = useState(
		new Ably.Realtime({
			clientId: "fake-client-id",
			token: "fake-token",
			authUrl: "api/rpc/getAblySubscribeToken",
		}),
	);

	useEffect(() => {
		client
			.getAblySubscribeToken()
			.then((token) => {
				ablyClient.connection.close();
				setAblyClient(
					new Ably.Realtime({
						clientId: token.clientId,
						token: token.token,
						authUrl: "api/rpc/getAblySubscribeToken",
					}),
				);
			})
			.catch(() => console.log("no token given."));

		return () => ablyClient.connection.close();
	}, [ablyClient.connection.close]);

	return (
		<AblyProvider client={ablyClient}>
			<ChannelProvider channelName="signatures">{children}</ChannelProvider>
		</AblyProvider>
	);
};

export default AppAblyProvider;
