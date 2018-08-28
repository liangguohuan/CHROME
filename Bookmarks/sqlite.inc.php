<?php

/**
 * Class helper
 * Web server user need permission for CURD.
 */
class SQLite
{
    public function __construct($file)
    {
        try {
            $this->connection = new PDO('sqlite:'.$file);
        } catch (PDOException $e) {
            try {
                $this->connection = new PDO('sqlite2:'.$file);
            } catch (PDOException $e) {
                exit('error!');
            }
        }
    }

    public function __destruct()
    {
        $this->connection = null;
    }

    public function query($sql)
    {
        return $this->connection->query($sql);
    }

    public function prepare($sql)
    {
        return $this->connection->prepare($sql);
    }

    public function insert($tbl, array $row, $breplace = false)
    {
        $action = $breplace ? 'REPLACE' : 'INSERT';
        $colums = implode(', ', array_keys($row));
        $placeholders = rtrim(str_repeat('?, ', count($row)));
        $placeholders = rtrim($placeholders, ',');
        $sql = sprintf("%s INTO `%s` (%s) VALUES (%s)", $action, $tbl, $colums, $placeholders);
        $sth = $this->prepare($sql);
        foreach (array_values($row) as $index => $value) {
            $sth->bindValue($index + 1, $value, PDO::PARAM_STR);
        }
        $sth->execute();
        return $sth;
    }

    public function getlist($sql)
    {
        $recordlist = $this->fetchAll($sql);

        return $recordlist;
    }

    public function fetch($sql)
    {
        return $this->query($sql)->fetch(PDO::FETCH_ASSOC);
    }

    public function fetchAll($sql)
    {
        return $this->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function lastInsertId()
    {
        return $this->connection->lastInsertId();
    }

    public function errorInfo()
    {
        return $this->connection->errorInfo();
    }
}

// common
include 'common.php';

// open database
$DB = new SQLite(DBNAME);

// first time create table
if (defined('FIRSTTIME')) {
    $sql = <<<EOF
      CREATE TABLE {TBLNAME} (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      TITLE           TEXT    NOT NULL,
      DOMAIN          TEXT    NOT NULL,
      HREF            TEXT    NOT NULL,
      SRC             TEXT    NOT NULL,
      UHASH           INTEGER NOT NULL UNIQUE,
      ATIME           TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
      UTIME           TEXT    NOT NULL DEFAULT (datetime('now','localtime')));
EOF;
    $sql = str_replace('TBLNAME', TBLNAME);

    $DB->query($sql);
}
