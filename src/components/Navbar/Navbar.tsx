import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
	return (
		<Flex bg="white" height="44px" padding="6px 12px">
			<Flex align="center">
				<Image alt="reddit logo" src="/images/redditFace.svg" height="30px" />
				<Image
					alt="reddit text logo"
					src="/images/redditText.svg"
					height="46PX"
					display={{ base: "none", md: "unset" }}
				/>
			</Flex>
			<SearchInput />
			{/* <Directory /> */}
			<RightContent />
		</Flex>
	);
};
export default Navbar;
