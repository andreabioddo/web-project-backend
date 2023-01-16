drop table hasfeature;
drop table features;
drop table tickets;
drop table shows;
drop table ratings;
drop table movies;
drop table seats;
drop table theaters;
drop table users;

create table users(
    id serial primary key,
    name text not null,
    email varchar(500) not null,
    password text not null,
    --password bytea not null,
    isadmin boolean default false not null,
    unique(email)
);

create table theaters (
    id serial primary key,
    name text not null,
    number_of_seats int not null check(number_of_seats >= 0)
);

create table seats (
    id serial primary key,
    number int not null,
    row int not null,
    type varchar(20) not null,
    removable boolean default false not null,
    id_theater int not null,
    foreign key (id_theater) references theaters(id) on update cascade on delete cascade
);

create table movies(
    id serial primary key,
    name text not null,
    description text,
    duration int check(duration >= 0),
    age int check(age >= 0)
);

create table ratings(
    stars int not null check(
        stars >= 0
        and stars <= 5
    ),
    review text not null,
    id_user int not null,
    id_movie int not null,
    foreign key (id_user) references users(id) on update cascade on delete cascade,
    foreign key (id_movie) references movies(id) on update cascade on delete cascade,
    unique(id_user, id_movie)
);

create table shows(
    id serial primary key,
    id_theater int not null,
    id_movie int not null,
    date date not null,
    time time not null,
    foreign key (id_theater) references theaters(id) on update cascade on delete cascade,
    foreign key (id_movie) references movies(id) on update cascade on delete cascade
);

create table tickets(
    id serial primary key,
    price decimal not null check(price >= 0),
    id_seat int not null,
    id_user int not null,
    id_show int not null,
    foreign key (id_user) references users(id) on update cascade on delete cascade,
    foreign key (id_show) references shows(id) on update cascade on delete cascade,
    foreign key (id_seat) references seats(id) on update cascade on delete cascade
);

create table features(
    id serial primary key,
    name text not null
);

create table hasfeature(
    id_feature int not null,
    id_theater int not null,
    foreign key (id_feature) references features(id) on update cascade on delete cascade,
    foreign key (id_theater) references theaters(id) on update cascade on delete cascade
);