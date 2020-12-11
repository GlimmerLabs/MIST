import React from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";

function CommentList(props) {
    const updateComment = (key, updatedComment) => {
        const newComments = props.comments.map(item => {
            if(item.key === key){
                return Object.assign(item, updatedComment);                
            } else{
                return item;
            }
        });
        props.updateComments(newComments);
    }

    return (props.comments.map(
        comment => (<Comment
            key={comment.key}
            comment={comment.comment}
            update={(newComment) => updateComment(comment.key, newComment)}
            x={comment.x}
            y={comment.y}
        />)
    ))
}

CommentList.propTypes = {
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            comment: PropTypes.string.isRequired,
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        })),
    updateComments: PropTypes.func.isRequired
}

export default CommentList;