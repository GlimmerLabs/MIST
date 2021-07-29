create table collections(
    collection_id serial primary key,
    title varchar(255) not null,
    caption varchar(255) not null,
    user_id varchar(255) not null references users(user_id),
    likes int default 0,

    created_at timestamptz not null default now()
);

--what type is contents??