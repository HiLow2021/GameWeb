USE mysql;

CREATE TABLE IF NOT EXISTS t_game_one_stroke_writing_question( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    width SMALLINT NOT NULL, 
    height SMALLINT NOT NULL, 
    block SMALLINT NOT NULL, 
    straight TINYINT(1) NOT NULL, 
    cells VARCHAR(1024) NOT NULL
);
