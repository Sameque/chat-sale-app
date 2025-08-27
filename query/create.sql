drop table messages_chat;
create table messages_chat (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid not null,
  receiver_id uuid not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter publication supabase_realtime add table messages_chat;

--ALTER TABLE messages_chat REPLICA IDENTITY FULL;


alter table messages_chat add column receiver text not null;
select * from users;
select * from messages_chat;