create table collections_images(
    post_id integer not null references posts(post_id),
    collection_id integer not null references collections(collection_id)
);

-- this table is meant to connect the posts and collections tables, by linking post ids to collection ids
-- when posts from a certain collection are retrieved, all the post ids with a certain collection id are retrieved