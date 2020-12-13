import { v4 as uuidv4 } from 'uuid';

class Comment {
    /**
     * Create a comment.
     * @param {number} x 
     * @param {number} y 
     * @param {string} comment 
     * @param {boolean} editing
     */
    constructor(x, y, comment, editing){
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.comment = comment;
        this.editing = editing;
    }
}

export default Comment;