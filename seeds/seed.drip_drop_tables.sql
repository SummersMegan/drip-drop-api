BEGIN;

TRUNCATE 
    drip_drop_reminders,
    drip_drop_users,
    drip_drop_plants RESTART IDENTITY CASCADE;

INSERT INTO drip_drop_plants (name,water_every,watering_directions,img)
VALUES
    ('ZZ Plant',7,'Water every 7 days','https://i.imgur.com/K6MOHxc.jpg'),
    ('Majesty Palm',3,'Water every 3 days','https://i.imgur.com/LYpYLjY.jpg'),
    ('Small Succulent',7,'Water every 7 days','https://i.imgur.com/3yIZfO9.jpg'),
    ('Snake Plant',14,'Water every 14 days','https://i.imgur.com/cmcHdMf.jpg');

INSERT INTO drip_drop_users (first_name,last_name,password,email,phone_number)
VALUES
    ('Megan','Wade','$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne','wademegan96@gmail.com','7739514325');

INSERT INTO drip_drop_reminders (plant_id,user_id,remind_on)
VALUES  
    (1,1,now()),
    (3,1,now());

COMMIT;