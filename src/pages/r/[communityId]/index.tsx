import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "../../../atoms/communityAtoms";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import CommunityNotFound from "../../../components/Community/NotFound";
import Header from "../../../components/Community/Header";
import PageContent from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";

type CommunityPageProps = {
	communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	// if theres no community it loads an error page telling the user that
	if (!communityData) {
		return <CommunityNotFound></CommunityNotFound>;
	}

	// if there is a community this return section gives a left hand side and ride hand side wrapped in fragments so they are the same on every page
	return (
		<>
			<Header communityData={communityData} />
			<PageContent>
				<>
					<CreatePostLink></CreatePostLink>
				</>
				<>
					<div>RHS</div>
				</>
			</PageContent>
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
