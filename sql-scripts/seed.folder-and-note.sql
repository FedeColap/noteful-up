
BEGIN;
-- first remove any data that may be present
TRUNCATE noteful_folders, noteful_notes;


INSERT INTO noteful_folders
    ( f_name)
    VALUES 
    ('Important'),
    ('Super'),
    ('Spangley');

INSERT INTO noteful_notes 
    (n_name , modified , folderId , content)
    VALUES 
    ( 'Dogs', '2019-01-03T00:00:00.000Z', 1, 'questa nota descrive un cane'),
    ( 'Cats', '2018-08-15T23:00:00.000Z', 2, 'questa nota descrive un gatto'),
    ( 'Pigs', '2018-03-01T00:00:00.000Z', 3, 'questa nota descrive un maiale'),
    ( 'Birds', '2019-01-04T00:00:00.000Z', 1, 'questa nota descrive un uccello'),
    ('Bears', '2018-07-12T23:00:00.000Z', 1, 'questa nota descrive un orso'),
    ( 'Horses', '2018-08-20T23:00:00.000Z', 2, 'questa nota descrive un cavallo'),
    ( 'Tigers', '2018-03-03T00:00:00.000Z', 3, 'questa nota descrive una tigre'),
    ( 'Wolves', '2018-05-16T23:00:00.000Z', 1, 'questa nota descrive un lupo'),
    ( 'Elephants', '2018-04-11T23:00:00.000Z', 3, 'questa nota descrive un elefante'),
    ( 'Lions', '2018-04-26T23:00:00.000Z', 1, 'questa nota descrive un leone'),
    ('Monkeys', '2018-02-05T00:00:00.000Z', 2, 'questa nota descrive una scimmia'),
    ( 'Turtles', '2018-09-11T23:00:00.000Z', 3, 'questa nota descrive una tartaruga'),
    ( 'Zebras', '2018-08-13T23:00:00.000Z', 1, 'questa nota descrive una zebra');

COMMIT;



