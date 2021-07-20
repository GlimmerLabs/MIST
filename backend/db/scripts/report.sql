create table reports(
    reported_user_id varchar(255) not null references users(user_id),
    report_reason varchar(255) not null,
    report_message varchar(255),

    created_at timestamptz not null default now()
);