<?php

// include DB
include_once 'sqlite.inc.php';

$act = $_REQUEST['act'];

if ($act == 'new') {
    // insert data
    $title  = trim($_REQUEST['title']);
    $href   = trim($_REQUEST['href']);
    $src    = trim($_REQUEST['src']);

    $info   = parse_url($href);
    $host   = $info['host'];
    $host   = str_replace('www.', '', $host);
    $domain = explode('.', $host)[0];
    $uhash  = crc32($href);

    $row['SRC'] = $src;
    $row['TITLE'] = $title;
    $row['HREf'] = $href;
    $row['DOMAIN'] = $domain;
    $row['UHASH'] = $uhash;

    $sth = $DB->insert(TBLNAME, $row);

    if (!is_null($sth->errorInfo()[2])) {
        $errinfo  = date('Y-m-d H:i:s') . "\n";
        $errinfo .= var_export($sth->errorInfo(), true) . "\n";
        file_put_contents('dba.log', $errinfo, FILE_APPEND | LOCK_EX);
    }

    // refresh web, warn: file_put_contents can not work in fork/exec
    shell_exec(sprintf('echo reload > %s', WSDATAFILENAME));

} elseif ($act == 'list') {
    echo json_encode($DB->getlist(sprintf("select * from %s order by UTIME desc", TBLNAME)));
} elseif ($act == 'uptime') {
    $ids = trim($_REQUEST['ids']);
    $sql = sprintf("UPDATE %s SET UTIME=%s WHERE id IN(%s)", TBLNAME, "datetime('now','localtime')", $ids);
    $DB->query($sql);
    echo $sql;
} elseif ($act == 'upinfo') {
    $id = $_REQUEST['id'];
    $src = trim($_REQUEST['src']);
    $title = trim($_REQUEST['title']);
    if (!empty($src)) {
        $sql = sprintf("UPDATE %s SET SRC=?, TITLE=? WHERE ID=?", TBLNAME);
        $sth = $DB->prepare($sql);
        $sth->bindValue(1, $src, PDO::PARAM_STR);
        $sth->bindValue(2, $title, PDO::PARAM_STR);
        $sth->bindValue(3, $id, PDO::PARAM_STR);
        $sth->execute();
    }
} elseif ($act == 'delete') {
    $id = $_REQUEST['id'];
    $sql = sprintf("DELETE FROM %s WHERE ID=?", TBLNAME);
    $sth = $DB->prepare($sql);
    $sth->bindValue(1, $id, PDO::PARAM_STR);
    $sth->execute();
}
