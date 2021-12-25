-- CREATE DATABASE registration_app;

create table towns (
    id serial not null primary key,
    town_name VARCHAR(10) NOT NULL,
    town_str text NOT NULL
);

create table registrations (
    id serial not null primary key,
    registration_numbers text NOT NULL,
    town_id int,
    foreign key (town_id) references towns(id)
);

-- Script
insert into towns (town_name,town_str) values('Cape Town', 'CA');
insert into towns (town_name,town_str) values('Pretoria', 'PA');
insert into towns (town_name,town_str) values('Worcester', 'WC'); 
