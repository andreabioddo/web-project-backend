-- Dummy data for table "users"
INSERT INTO users (name, email, password, isadmin) VALUES
('John Doe', 'johndoe@example.com', 'password1', true),
('Jane Smith', 'janesmith@example.com', 'password2', false),
('Bob Johnson', 'bobjohnson@example.com', 'password3', false),
('Samantha Williams', 'samanthawilliams@example.com', 'password4', true),
('Michael Brown', 'michaelbrown@example.com', 'password5', false),
('Emily Davis', 'emilydavis@example.com', 'password6', true),
('Jacob Miller', 'jacobmiller@example.com', 'password7', false),
('Nicholas Garcia', 'nicholasgarcia@example.com', 'password8', true),
('Alexander Martinez', 'alexandermartinez@example.com', 'password9', false),
('William Rodriguez', 'williamrodriguez@example.com', 'password10', true),
('Mark Thompson', 'markthompson@example.com', 'password11', false),
('David Garcia', 'davidgarcia@example.com', 'password12', true),
('Robert Martinez', 'robertmartinez@example.com', 'password13', false),
('Michael Robinson', 'michaelrobinson@example.com', 'password14', true),
('John Lewis', 'johnlewis@example.com', 'password15', false),
('Jessica Harris', 'jessicaharris@example.com', 'password16', true),
('Daniel Lewis', 'danielllewis@example.com', 'password17', false),
('Matthew Young', 'matthewyoung@example.com', 'password18', true),
('Andrew Hernandez', 'andrewhernandez@example.com', 'password19', false),
('Brian Moore', 'brianmoore@example.com', 'password20', true),
('Kevin Martin', 'kevinmartin@example.com', 'password21', false),
('Edward Thompson', 'edwardthompson@example.com', 'password22', true),
('Ronald Garcia', 'ronaldgarcia@example.com', 'password23', false),
('Anthony Martinez', 'anthonymartinez@example.com', 'password24', true),
('Kevin Moore', 'kevinmoore@example.com', 'password25', false),
('James Jackson', 'jamesjackson@example.com', 'password26', true),
('Justin Martin', 'justinmartin@example.com', 'password27', false),
('Brandon Davis', 'brandondavis@example.com', 'password28', true),
('Jonathan Garcia', 'jonathangarcia@example.com', 'password29', false),
('Josh Martinez', 'joshmartinez@example.com', 'password30', true);

-- Dummy data for table "theaters"
INSERT INTO theaters (name, number_of_seats) VALUES
('Theater 1', 200),
('Theater 2', 150),
('Theater 3', 250),
('Theater 4', 300),
('Theater 5', 100),
('Theater 6', 250),
('Theater 7', 200),
('Theater 8', 150),
('Theater 9', 250),
('Theater 10', 300),
('Theater 11', 100),
('Theater 12', 250),
('Theater 13', 200),
('Theater 14', 150),
('Theater 15', 250),
('Theater 16', 300),
('Theater 17', 100),
('Theater 18', 250),
('Theater 19', 200),
('Theater 20', 150),
('Theater 21', 250),
('Theater 22', 300),
('Theater 23', 100),
('Theater 24', 250),
('Theater 25', 200),
('Theater 26', 150),
('Theater 27', 250),
('Theater 28', 300),
('Theater 29', 100),
('Theater 30', 250);

-- Dummy data for table "movies"
INSERT INTO movies (name, description, duration, age) VALUES
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 142, 18),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 175, 21),
('The Dark Knight', 'When Batman, Gordon and Harvey Dent launch an assault on the mob, they let the clown out of the box, the Joker, bent on turning Gotham on itself and bringing any heroes down to his level.', 152, 18),
('The Lord of the Rings: The Return of the King', 'Gandalf and Aragorn lead the World of Men against Sauron''s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', 201, 13),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster''s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 154, 18),
('Schindler''s List', 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', 195, 18),
('The Good, the Bad and the Ugly', 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', 161, 16),
('Fight Club', 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.', 139, 18),
('Forrest Gump', 'Forrest Gump, while not intelligent, has accidentally been present at many historic moments, but his true love, Jenny Curran, eludes him.', 142, 12),
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.', 148, 12),
('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 136, 18),
('Goodfellas', 'The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family.', 146, 18),
('One Flew Over the Cuckoo''s Nest', 'Upon arrival at a mental institution, a brash rebel rallies the patients together to take on the oppressive Nurse Ratched, a woman more dictator than nurse.', 133, 18),
('Seven Samurai', 'A poor village under attack by bandits recruits seven unemployed samurai to help them defend themselves.', 207, 13),
('Se7en', 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his modus operandi.', 127, 18),
('The Silence of the Lambs', 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.', 118, 18),
('It''s a Wonderful Life', 'An angel helps a compassionate but despairingly frustrated,3', 200, 12);

-- Dummy data for table "features"
INSERT INTO features (name) VALUES
('3D'),
('IMAX'),
('Dolby Atmos'),
('VIP seating'),
('Recliner seats'),
('Food service'),
('Bar service'),
('Online booking'),
('Wheelchair accessible'),
('Private screening room'),
('4K resolution'),
('HFR (High Frame Rate)'),
('Laser projection'),
('UltraAVX'),
('RealD 3D'),
('D-Box'),
('Cineplex VIP Cinema'),
('UltraAVX 3D'),
('SCENE VIP'),
('UltraAVX 4K'),
('Cineplex IMAX'),
('Cineplex UltraAVX'),
('Cineplex VIP'),
('Cineplex 3D'),
('Cineplex 4K'),
('Cineplex D-BOX'),
('Cineplex HFR'),
('Cineplex Laser Projection'),
('Cineplex UltraAVX 3D'),
('Cineplex SCENE VIP');


-- Dummy data for table "hasfeature"
INSERT INTO hasfeature (id_feature, id_theater) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 3),
(6, 3),
(7, 4),
(8, 4),
(9, 5),
(10, 5),
(11, 6),
(12, 6),
(13, 7),
(14, 7),
(15, 8),
(16, 8),
(17, 9),
(18, 9),
(19, 10),
(20, 10),
(21, 11),
(22, 11),
(23, 12),
(24, 12),
(25, 13),
(26, 13),
(27, 14),
(28, 14),
(29, 15),
(30, 15);


-- Dummy data for table "ratings"
INSERT INTO ratings (stars, review, id_user, id_movie) VALUES
(5, 'Great movie!', 1, 1),
(4, 'Really enjoyed it', 2, 1),
(3, 'It was okay', 3, 1),
(5, 'Amazing!', 4, 2),
(4, 'Loved it', 5, 2),
(2, 'Not my cup of tea', 6, 2),
(5, 'Outstanding', 7, 3),
(3, 'Could have been better', 8, 3),
(4, 'Really liked it', 9, 4),
(5, 'Fantastic', 10, 4),
(1, 'Terrible', 11, 5),
(2, 'Disappointing', 12, 5),
(4, 'Really good', 13, 6),
(5, 'Incredible', 14, 6),
(3, 'Just okay', 15, 7),
(5, 'Absolutely loved it', 16, 7),
(2, 'Not impressed', 17, 8),
(4, 'Pretty good', 18, 8),
(3, 'Could have been better', 19, 9),
(4, 'Enjoyed it', 20, 9),
(2, 'Not great', 21, 10),
(5, 'Amazing', 22, 10),
(4, 'Really liked it', 23, 11),
(3, 'It was okay', 24, 11),
(5, 'Loved it', 25, 12),
(4, 'Really enjoyed it', 26, 12),
(3, 'Just okay', 27, 13),
(2, 'Disappointing', 28, 13),
(4, 'Pretty good', 29, 14),
(5, 'Fantastic', 30, 14);

-- Dummy data for table "shows"
INSERT INTO shows (id_theater, id_movie, date, time) VALUES
(1, 1, '2022-05-01', '19:00:00'),
(2, 2, '2022-05-02', '20:00:00'),
(3, 3, '2022-05-03', '21:00:00'),
(4, 4, '2022-05-04', '22:00:00'),
(5, 5, '2022-05-05', '23:00:00'),
(6, 6, '2022-05-06', '19:00:00'),
(7, 7, '2022-05-07', '20:00:00'),
(8, 8, '2022-05-08', '21:00:00'),
(9, 9, '2022-05-09', '22:00:00'),
(10, 10, '2022-05-10', '23:00:00'),
(11, 1, '2022-05-11', '19:00:00'),
(12, 2, '2022-05-12', '20:00:00'),
(13, 3, '2022-05-13', '21:00:00'),
(14, 4, '2022-05-14', '22:00:00'),
(15, 5, '2022-05-15', '23:00:00'),
(16, 6, '2022-05-16', '19:00:00'),
(17, 7, '2022-05-17', '20:00:00'),
(18, 8, '2022-05-18', '21:00:00'),
(19, 9, '2022-05-19', '22:00:00'),
(20, 10, '2022-05-20', '23:00:00'),
(21, 1, '2022-05-21', '19:00:00'),
(22, 2, '2022-05-22', '20:00:00'),
(23, 3, '2022-05-23', '21:00:00'),
(24, 4, '2022-05-24', '22:00:00'),
(25, 5, '2022-05-25', '23:00:00'),
(26, 6, '2022-05-26', '19:00:00'),
(27, 7, '2022-05-27', '20:00:00'),
(28, 8, '2022-05-28', '21:00:00'),
(29, 9, '2022-05-29', '22:00:00'),
(30, 10, '2022-05-30', '23:00:00');

-- Dummy data for table "seats"
INSERT INTO seats (number, row, type, removable, id_theater) VALUES
(1, 1, 'VIP', true, 1),
(2, 1, 'VIP', true, 1),
(3, 1, 'VIP', true, 1),
(4, 2, 'Regular', true, 1),
(5, 2, 'Regular', true, 1),
(6, 2, 'Regular', true, 1),
(7, 3, 'Regular', true, 1),
(8, 3, 'Regular', true, 1),
(9, 3, 'Regular', true, 1),
(10, 4, 'Regular', true, 1),
(11, 4, 'Regular', true, 1),
(12, 4, 'Regular', true, 1),
(13, 1, 'VIP', true, 2),
(14, 1, 'VIP', true, 2),
(15, 1, 'VIP', true, 2),
(16, 2, 'Regular', true, 2),
(17, 2, 'Regular', true, 2),
(18, 2, 'Regular', true, 2),
(19, 3, 'Regular', true, 2),
(20, 3, 'Regular', true, 2),
(21, 3, 'Regular', true, 2),
(22, 4, 'Regular', true, 2),
(23, 4, 'Regular', true, 2),
(24, 4, 'Regular', true, 2),
(25, 1, 'VIP', true, 3),
(26, 1, 'VIP', true, 3),
(27, 1, 'VIP', true, 3);


-- Dummy data for table "tickets"
INSERT INTO tickets (price, id_seat, id_user, id_show) VALUES
(20, 1, 1, 1),
(15, 2, 2, 1),
(20, 3, 3, 2),
(25, 4, 4, 2),
(30, 5, 5, 3),
(35, 6, 6, 3),
(40, 7, 7, 4),
(50, 8, 8, 4),
(60, 9, 9, 5),
(70, 10, 10, 5),
(80, 11, 11, 6),
(90, 12, 12, 6),
(100, 13, 13, 7),
(110, 14, 14, 7),
(120, 15, 15, 8),
(130, 16, 16, 8),
(140, 17, 17, 9),
(150, 18, 18, 9),
(160, 19, 19, 10),
(170, 20, 20, 10),
(180, 21, 21, 11),
(190, 22, 22, 11),
(200, 23, 23, 12),
(210, 24, 24, 12),
(220, 25, 25, 13),
(230, 26, 26, 13),
(240, 7, 27, 14),
(250, 8, 28, 14),
(260, 9, 29, 15),
(270, 3, 30, 15);
