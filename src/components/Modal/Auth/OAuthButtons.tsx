import { Flex, Button, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

const OAuthButtons: React.FC = () => {
	const [signInWithgoogle, user, loading, error] = useSignInWithGoogle(auth);
	return (
		<Flex direction="column" width="100%" mb={4}>
			<Button
				variant="oauth"
				mb={2}
				isLoading={loading}
				onClick={() => signInWithgoogle()}
			>
				<Image
					alt="google logo"
					src="/images/googlelogo.png"
					height="20px"
					mr={4}
				/>
				Continue with Google
			</Button>
			<Button variant="oauth">some other provider</Button>
			{error && <Text>{error.message}</Text>}
		</Flex>
	);
};
export default OAuthButtons;
