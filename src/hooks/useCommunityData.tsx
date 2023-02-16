import {
	getDocs,
	collection,
	writeBatch,
	doc,
	increment,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import {
	Community,
	CommunitySnippet,
	communityState,
} from "../atoms/communityAtoms";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {
	const [user] = useAuthState(auth);
	const [communityStateValue, setCommunityStateValue] =
		useRecoilState(communityState);
	const setAuthModalState = useSetRecoilState(authModalState);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// a function to update the firebase databases when a user joins or leaves the community

	const onJoinOrLeaveCommunity = (
		communityData: Community,
		isJoined: boolean
	) => {
		// if the user is not logged in and clicks join community, the AuthModal opens and prompts them to login or signup
		if (!user) {
			setAuthModalState({ open: true, view: "login" });
			return;
		}
		setLoading(true);

		// if the user has already joined, clicking the button will make them leave the community
		if (isJoined) {
			leaveCommunity(communityData.id);
			return;
		}
		joinCommunity(communityData);
	};

	// a function that grabs all the community data from the firebase database about the user then puts them in an array called mySnippets
	const getMySnippets = async () => {
		setLoading(true);
		try {
			const snipppetDocs = await getDocs(
				collection(firestore, `users/${user?.uid}/communitySnippets`)
			);

			const snippets = snipppetDocs.docs.map((doc) => ({ ...doc.data() }));
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: snippets as Array<CommunitySnippet>,
			}));
		} catch (error: any) {
			console.log("get my snippets error", error);
			setError(error.message);
		}
		setLoading(false);
	};

	// a function to batch write joining the community * batch write will do all of the function or none of the function
	const joinCommunity = async (communityData: Community) => {
		try {
			const batch = writeBatch(firestore);

			const newSnippet: CommunitySnippet = {
				communityId: communityData.id,
				imageURL: communityData.imageURL || "",
			};

			// telling the batch where to update the information and what to update it with
			batch.set(
				doc(
					firestore,
					`users/${user?.uid}/communitySnippets`,
					communityData.id
				),
				newSnippet
			);

			batch.update(doc(firestore, "communities", communityData.id), {
				numberOfMembers: increment(1),
			});

			// getting the previous state of user communities, spreading it out and adding the newly joined community to the end of the list
			await batch.commit();
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: [...prev.mySnippets, newSnippet],
			}));
		} catch (error: any) {
			console.log("join community error", error);
			setError(error.message);
		}
		setLoading(false);
	};

	// the same as above but opposite
	const leaveCommunity = async (communityId: string) => {
		try {
			const batch = writeBatch(firestore);
			batch.delete(
				doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
			);

			batch.update(doc(firestore, "communities", communityId), {
				numberOfMembers: increment(-1),
			});

			await batch.commit();

			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: prev.mySnippets.filter(
					(item) => item.communityId !== communityId
				),
			}));
		} catch (error: any) {
			console.log("leave community error", error);
			setError(error.message);
		}
		setLoading(false);
	};

	// everytime the user changes this function runs and gets the community data for that user
	useEffect(() => {
		if (!user) return;
		getMySnippets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// 	returning these as variables means we can destructure* them as props in other functions and use them globally
	return {
		//data and functions
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	};
};
export default useCommunityData;
