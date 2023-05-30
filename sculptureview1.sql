CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `viewsculpture1` AS
    SELECT 
        `sculpture`.`sculptureid` AS `sculptureid`,
        `sculpture`.`keyword` AS `keyword`,
        `sculpture`.`image` AS `image`,
        `sculpture`.`sculpturename` AS `sculpturename`,
        `temple`.`t_name` AS `t_name`,
        `temple`.`city` AS `city`,
        `temple`.`state` AS `state`
    FROM
        (`sculpture`
        JOIN `temple` ON ((`sculpture`.`templeid` = `temple`.`temple_id`)))