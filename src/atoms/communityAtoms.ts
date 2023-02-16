import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

// the interface that defines the community atom and each key we expect to see in it
export interface Community {
	id: string;
	creatorId: string;
	numberOfMembers: number;
	privacyType: "public" | "restricted" | "private";
	createdAt?: Timestamp;
	imageURL?: string;
}

// the interfface for community snippets, this tells the app if a user is a community member
export interface CommunitySnippet {
	communityId: string;
	isModerator?: boolean;
	imageURL?: string;
}

// the interface for an array of each community a user is in
interface CommunityState {
	mySnippets: CommunitySnippet[];
	//visitedCommunities
}

const defaultCommunityState: CommunityState = {
	mySnippets: [],
};

export const communityState = atom<CommunityState>({
	key: "communitiesState",
	default: defaultCommunityState,
});
