import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "../../../atoms/communityAtoms";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import CommunityNotFound from "../../../components/Community/NotFound";
import Head from "next/head";
import Header from "../../../components/Community/Header";

type CommunityPageProps = {
	communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	if (!communityData) {
		return <CommunityNotFound></CommunityNotFound>;
	}

	return (
		<>
			<Header communityData={communityData} />
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// get community data and pass to client
	try {
		const communityDocRef = doc(
			firestore,
			"communities",
			context.query.communityId as string
		);
		const communityDoc = await getDoc(communityDocRef);

		return {
			props: {
				communityData: communityDoc.exists()
					? JSON.parse(
							safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
					  )
					: "",
			},
		};
	} catch (error) {
		//could add error page here
		console.log("getServerSideProps.error", error);
	}
}

export default CommunityPage;
