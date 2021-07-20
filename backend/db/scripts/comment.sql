create table comments(
    comment_id serial primary key,
    contents text not null,
    user_id varchar(255) not null references users(user_id),
    post_id integer not null references posts(post_id),
    parent_comment_id integer references comments(comment_id),
    likes int default 0,

    created_at timestamptz not null default now()
);

--parent_comment: used for replies to other comments. if null, the comment is not a reply