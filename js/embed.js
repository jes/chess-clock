function EmbedChessClock(div_id, width, piece_theme) {
    $('#' + div_id).html("<span style=\"font-size:1.2em;font-weight:bold\" id=\"" + div_id + "-hms\"></span><div id=\"" + div_id + "-board\" style=\"width:" + width + "\"></div><span id=\"" + div_id + "-san\"></span><br>(next <span id=\"" + div_id + "-move\"></span> in <b id=\"" + div_id + "-nextmove\"></b> <span id=\"" + div_id + "-seconds\"></span>)");

    if (!piece_theme)
        piece_theme = 'img/chesspieces/wikipedia/{piece}.png';

    let board = ChessBoard(div_id + '-board', {
        position: 'start',
        piecetheme: piece_theme,
    });
    function redraw(use_anim) {
        let now = new Date();
        let hour = now.getHours();
        let min = now.getMinutes();
        let sec = now.getSeconds();
        let secsinday = hour*3600 + min*60 + sec;
        let boardposition = Math.floor(secsinday/10) % clock_fens.length;
        board.position(clock_fens[boardposition], use_anim);

        $('#' + div_id + '-hms').text(pad(hour,2) + ":" + pad(min,2) + ":" + Math.floor(sec/10) + "0");
        let secondsleft = 10 - (sec%10);
        $('#' + div_id + '-nextmove').text(secondsleft);
        $('#' + div_id + '-seconds').text("second" + (secondsleft == 1 ? '' : 's'));
        $('#' + div_id + '-move').text(boardposition == 8639 ? 'game' : 'move');

        let pgn = '';
        let startsan = 1;
        let endsan = boardposition;
        let showmoves = 7;
        if (endsan > showmoves+1) {
            startsan = endsan - showmoves;
            pgn = '[...] ';
        }
        if (startsan % 2 == 0) // always start with a white move
            startsan++;
        for (let i = startsan; i <= endsan; i++) {
            if (i % 2 == 1) { // move number before white move
                pgn += Math.ceil(i/2) + ". ";
            }
            pgn += clock_sans[i] + " ";
        }
        $('#' + div_id + '-san').text(pgn);
    }
    redraw(false);
    window.setInterval(function() { redraw(true) }, 1000);

    // https://stackoverflow.com/a/10073788
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
