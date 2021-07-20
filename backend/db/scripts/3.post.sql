create table posts(
    post_id serial primary key,
    title varchar(255) not null,
    caption varchar(255),
    code varchar(255) not null,
    user_id varchar(255) not null references users(user_id),
    public boolean not null,
    likes int default 0,
    featured boolean not null default false,

    created_at timestamptz not null default now()
);
-- work on featured?
