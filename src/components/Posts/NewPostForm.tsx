import { Flex, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";

type NewPostFormProps = {};

const formTabs = [
	{
		title: "Post",
		icon: IoDocumentText,
	},
	{
		title: "Images & Video",
		icon: IoImageOutline,
	},
	{
		title: "Link",
		icon: BsLink45Deg,
	},
	{
		title: "Poll",
		icon: BiPoll,
	},
	{
		title: "Talk",
		icon: BsMic,
	},
];

export type TabItems = {
	title: string;
	icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = () => {
	const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
	return (
		<Flex direction="column" bg="white" borderRadius={4} mt={2}>
			<Flex width="100%">
				{formTabs.map((item, index) => (
					<TabItem
						item={item}
						key={item.title + index}
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				))}
			</Flex>
		</Flex>
	);
};
export default NewPostForm;
