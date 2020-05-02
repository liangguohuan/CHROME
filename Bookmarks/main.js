var table;

$(document).ready(function () {
    table = $('#example').DataTable({
        'pagingType': 'input',
        'pageLength': 18,
        'lengthMenu': [
            [18, 36, -1],
            [18, 36, 'All']
        ],
        'ajax': {
            url: '/act.php?act=list',
            dataSrc: ''
        },
        'columns': [
            { data: 'ID' },
            { data: 'SRC' },
            { data: 'HREF' },
            { data: 'TITLE' },
            { data: 'DOMAIN' },
            { data: 'UTIME' }
        ]
    });

    // reload
    var ele = '<sapn id="reload" onclick="RELOAD()">↺</sapn>';
    $('#example_filter').prepend(ele);

    var boxtemplate = `
                <div class="box-item" unique="{id}">
                    <a href="{href}">
                        <div class="box-operate box-update">✎</div>
                        <div class="box-operate box-delete">✗</div>
                        <div class="box-img">
                            <img src="{src}" />
                        </div>
                        <div class="box-title" title="{title}">{title}</div>
                    </a>
                </div>
                `;
    table.on('draw', function () {
        // imgbox viewer
        $('#list').empty();
        $.each($('tbody > tr'), function (i, item) {
            var box = boxtemplate;
            box = box.replace('{id}', $(item).find('td').eq(0).text());
            box = box.replace('{href}', $(item).find('td').eq(2).text());
            box = box.replace('{src}', $(item).find('td').eq(1).text());
            box = box.replace('{title}', $(item).find('td').eq(3).text());
            box = box.replace('{title}', $(item).find('td').eq(3).text());
            $('#list').append(box);
        });

        $('.box-item').hover(
            function () {
                $(this).find('.box-operate').css('opacity', 1);
            },
            function () {
                $(this).find('.box-operate').css('opacity', 0);
            }
        );

        // UPTIME viewer
        if ($('#example_filter input').first().val() == "") {
            $('#uptime').remove();
        } else {
            if ($('#uptime').prop('tagName') == undefined) {
                var ele = '<sapn id="uptime" onclick="UPTIME()">✩</sapn>';
                $('#example_filter').prepend(ele);
            }
        }

        // update info
        $('.box-update').on('click', function() {
            var ID = $(this).parents('.box-item').first().attr('unique');
            var SRC = $(this).nextAll('.box-img').find('img').prop('src');
            var TITLE = encodeURIComponent($(this).nextAll('.box-title').first().text());
            var PARAMSTR = 'id=' + ID + '&src=' + SRC + '&title=' + TITLE;
            $.fancybox.open({
                src: '/update.html?callback=CALLBACK&' + PARAMSTR,
                type: 'iframe'
            });
            return false;
        });

        // delete
        $('.box-delete').on('click', function() {
            var ID = $(this).parents('.box-item').first().attr('unique');
            var data = 'act=delete&id=' + ID;
            $.get('/act.php', data, function (res) {
                RELOAD();
            });
            return false;
        });
    });


    // setup websocket with callbacks
    var ws = new WebSocket('ws://localhost:8484/');
    ws.onopen = function() {
        console.log('CONNECT');
    };
    ws.onclose = function() {
        console.log('DISCONNECT');
    };
    ws.onmessage = function(event) {
        console.log('MESSAGE: ' + event.data);
        if (event.data == 'reload') {
            RELOAD();
        }
    };
    ws.onerror = function() {
        console.log('ERROR');
    };

});

function RELOAD() {
    table.ajax.reload();
}

function CALLBACK() {
    $.fancybox.close();
    RELOAD();
}

function UPTIME() {
    var ids = new Array();
    $('.box-item').each(function (i, item) {
        ids.push($(item).attr('unique'));
    });
    var data = 'ids=' + ids.toString() + '&act=uptime';
    $.get('/act.php', data, function (res) {
        // console.log(res)
        // reload datasrc after updating
        table.ajax.reload();
    });
}
