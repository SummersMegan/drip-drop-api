BEGIN;

TRUNCATE 
    drip_drop_reminders,
    drip_drop_plants;

INSERT INTO drip_drop_plants (name,water_every,watering_directions,img)
VALUES
    ('ZZ Plant',7,'Water every 7 days','https://i.imgur.com/K6MOHxc.jpg'),
    ('Majesty Palm',3,'Water every 3 days','https://i.imgur.com/LYpYLjY.jpg'),
    ('Small Succulent',7,'Water every 7 days','https://i.imgur.com/3yIZfO9.jpg'),
    ('Snake Plant',14,'Water every 14 days','https://i.imgur.com/cmcHdMf.jpg');

INSERT INTO drip_drop_reminders (plant_id,user_id)
VALUES  
    (1,1),
    (3,1),
    (1,2),
    (2,2),
    (3,2),
    (1,3);

COMMIT;