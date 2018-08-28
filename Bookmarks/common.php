<?php

if (!file_exists('data.db')) {
    define('FIRSTTIME', 1);
}

// make sure DBNAME and WSDATAFILENAME get WRITE PERMISSION for WEBSERVER
define('DBNAME', 'data.db');
define('TBLNAME', 'BOOKMARKS');
define('WSDATAFILENAME', 'DATA.ws');
