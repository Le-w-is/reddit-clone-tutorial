import { Button, Flex } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { auth } from "../../../firebase/clientApp";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";

type RightContentProps = {
	user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
	return (
		<>
			<AuthModal />
			<Flex justify="center" align="center">
				{user ? (
					<Button onClick={() => signOut(auth)}>Log Out</Button>
				) : (
					<AuthButtons />
				)}
				{/*  menu */}
			</Flex>
		</>
	);
};

export default RightContent;
