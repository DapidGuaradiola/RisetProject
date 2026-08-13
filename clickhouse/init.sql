CREATE DATABASE IF NOT EXISTS analytics;
USE analytics;
CREATE TABLE comments
(
    comment_id UInt64,
    parent_comment_id Nullable(UInt64),
    level integer,
    comment text,
    user_id UInt64,
    video_id UInt64,
    create_time Nullable(Int64),
    __deleted String,
    __table String,
    __lsn Int64
) ENGINE = Kafka()
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'analytics.public.comments',
    kafka_group_name = 'clickhouse_comments_group_v2',
    kafka_format = 'JSONEachRow';

CREATE TABLE comments_storage
(
    comment_id UInt64,
    parent_comment_id Nullable(UInt64),
    level Int32,
    comment String,
    user_id UInt64,
    video_id UInt64,
    create_time Nullable(DateTime64(6))
) ENGINE = MergeTree ORDER BY comment_id;

CREATE TABLE users
(
    user_id UInt64,
    followers_count integer,
    nickname varchar,
    username varchar,
    create_time Nullable(Int64),
    __deleted String,
    __table String,
    __lsn Int64
) ENGINE = Kafka()
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'analytics.public.users',
    kafka_group_name = 'clickhouse_users_group',
    kafka_format = 'JSONEachRow';

CREATE TABLE users_storage
(
    user_id UInt64,
    followers_count integer,
    nickname varchar,
    username varchar,
    create_time Nullable(Int64),
    __deleted String,
    __table String,
    __lsn Int64
) ENGINE = ReplacingMergeTree ORDER BY user_id, followers_count

CREATE MATERIALIZED VIEW comments_mv TO comments_storage AS
SELECT
    comment_id,
    parent_comment_id,
    level,
    comment,
    user_id,
    video_id,
    if(create_time IS NULL, NULL, fromUnixTimestamp64Micro(create_time)) AS create_time
FROM comments
WHERE __deleted = 'false';

CREATE MATERIALIZED VIEW users_mv TO users_storage AS
SELECT
    user_id UInt64,
    followers_count integer,
    nickname varchar,
    username varchar,
    if(create_time IS NULL, NULL, fromUnixTimestamp64Micro(create_time)) AS create_time
FROM users
WHERE __deleted = 'false';