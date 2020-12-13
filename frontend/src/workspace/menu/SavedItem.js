import React from 'react';
import { Label, Tag, Text } from 'react-konva';
import PropTypes from "prop-types";

function SavedItem(props) {
	// https://konvajs.org/docs/shapes/Label.html
	return (
		<Label
			visible={props.tabs.savedOpen}
			x={props.x}
			y={props.y}
		>
			<Tag
				fill={props.color}
				cornerRadius='5'
				shadowColor='black'
			/>
			<Text
				padding='15'
				fontSize='25'
				text={props.name}
				onClick={props.openWorkspace}
				onTap={props.openWorkspace}
				fill='white'
			/>
		</Label>
	);
}

SavedItem.propTypes = {
	openWorkspace: PropTypes.func.isRequired
}

export default SavedItem;