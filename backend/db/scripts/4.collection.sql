create table collections(
    collection_id serial primary key,
    title varchar(255) not null,
    caption varchar(255) not null,
    contents varchar(255)[][] not null, --contents[0] is an array of image titles, contents[1] is an array of corresponding user ids
    user_id varchar(255) not null references users(user_id),
    likes int default 0,

    created_at timestamptz not null default now()
);

--what type is contents??