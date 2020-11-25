import React from 'react';
import { Group, Label, Rect, Tag, Text } from 'react-konva';

export default function SavedItem(props) {
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
                onClick={props.openWS}
                onTap={props.openWS}
                fill='white'
            />
        </Label>
    );
}