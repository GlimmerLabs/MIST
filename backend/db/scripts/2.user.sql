create table users(
    user_id varchar(255) not null unique primary key,
    email varchar(255) not null unique,
    password varchar(255) not null, 
    fullname varchar(255),
    about varchar(255),
    verified boolean default false,
    need_tutorial boolean default true,
    admin boolean default false,
    profile_pic varchar(255),
    is_demo_user boolean default false,
    report_flags int default 0,

    token varchar(255),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()

);
-- TODO work on blocked user later
-- TODO work on liked image
-- TODO work on commented image

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();