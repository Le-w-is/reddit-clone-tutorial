import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { Community } from "../../atoms/communityAtoms";
import useCommunityData from "../../hooks/useCommunityData";

type HeaderProps = {
	communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
	// importing community state and join leave functions
	const { communityStateValue, onJoinOrLeaveCommunity, loading } =
		useCommunityData();

	//  !! booleanises the return from the find function
	const isJoined = !!communityStateValue.mySnippets.find(
		(item) => item.communityId === communityData.id
	);
	return (
		<Flex direction="column" width="100%" height="146px">
			<Box height="50%" bg="blue.400" />
			<Flex justify="center" bg="white" flexGrow={1}>
				<Flex width="95%" maxWidth="860px">
					{/* if there is a community image it shows it, if not it defaults to the reddit icon */}
					{communityData.imageURL ? (
						<Image alt="community image" />
					) : (
						<Icon
							as={FaReddit}
							fontSize={64}
							position="relative"
							top={-3}
							color="blue.500"
							border="4px solid white"
							borderRadius="50%"
						/>
					)}
					<Flex padding="10px 16px">
						<Flex direction="column" mr={6}>
							<Text fontWeight={800} fontSize="16pt">
								{communityData.id}
							</Text>
							<Text fontWeight={600} fontSize="10pt" color="gray.400">
								r/{communityData.id}
							</Text>
						</Flex>
						<Button
							variant={isJoined ? "outline" : "solid"}
							height="30px"
							pr={6}
							pl={6}
							isLoading={loading}
							onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
						>
							{isJoined ? "Joined" : "join"}
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
export default Header;
