import { v4 as uuidv4 } from 'uuid';

class Comment {
    /**
     * Create a comment.
     * @param {number} x 
     * @param {number} y 
     * @param {string} comment 
     */
    constructor(x, y, comment){
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.comment = comment;
    }
}

export default Comment;