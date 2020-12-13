import React from "react";
import PropTypes from "prop-types";
import CommentNode from "./CommentNode";
import Comment from "../classes/Comment";

function CommentList(props) {

    /** @type {Comment[]} */
    const comments = props.comments;

    /**
     * Update a specific comment. 
     * @param {string} id 
     * @param {string} updatedComment 
     */
    const updateComment = (id, updatedComment) => {
        const newComments = props.comments.map(item => {
            if (item.id === id) {
                return Object.assign(item, updatedComment);
            } else {
                return item;
            }
        });
        props.updateComments(newComments);
    }

    /**
     * Delete a specific comment.
     * @param {string} id
     */
    const deleteComment = (id) => {
        const newComments = comments.filter((item) => item.id !== id);
        props.updateComments(newComments);
    }

    return (comments.map(
        comment => (<CommentNode
            key={comment.id}
            comment={comment.comment}
            update={(newComment) => updateComment(comment.id, newComment)}
            x={comment.x}
            y={comment.y}
            editing={comment.editing}
        />)
    ))
}

CommentList.propTypes = {
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            comment: PropTypes.string.isRequired,
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            editing: PropTypes.bool.isRequired
        })),
    updateComments: PropTypes.func.isRequired
}

export default CommentList;