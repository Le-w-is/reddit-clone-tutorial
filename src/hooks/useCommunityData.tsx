import {
	getDocs,
	collection,
	writeBatch,
	doc,
	increment,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const onJoinOrLeaveCommunity = (
		communityData: Community,
		isJoined: boolean
	) => {
		if (isJoined) {
			leaveCommunity(communityData.id);
			return;
		}
		joinCommunity(communityData);
	};

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

	const joinCommunity = async (communityData: Community) => {
		try {
			const batch = writeBatch(firestore);

			const newSnippet: CommunitySnippet = {
				communityId: communityData.id,
				imageURL: communityData.imageURL || "",
			};

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

	useEffect(() => {
		if (!user) return;
		getMySnippets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);
	return {
		//data and functions
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	};
};
export default useCommunityData;
