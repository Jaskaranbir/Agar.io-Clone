var Socket = (function (stage, playerAlias) {
    var canvasProps = stage.props;
    var canvasContext = stage.context;

    var player;
    var enemies;
    var foods;
    
    var gameloop;
    var chatHandler;
    var leaderboard;
    
    var webSocket;

    var props = {
        currentReconnectAttempts: 0,
        reconnectAttemptsLimit: 15,
        gotAccidentalDisconnect: false
    };

    var updatePacket = {
        chatString: '',
        remFoods: '',
        remPlayers: ''
    };

    var configSocket = function () {
        if (!playerAlias)
            playerAlias = '^';
        webSocket = new WebSocket('ws://' + window.location.host + '/agario/agariosocket/' + playerAlias);

        webSocket.onopen = function () {
            if(props.gotAccidentalDisconnect) {
                player.props.isDisconnected = false;
                sendData();
            }
        };
        webSocket.onmessage = function (data) {
            data = data.data;
            if (!player)
                initGame(data);
            else
                play(data);
        };
        webSocket.onclose = function () {
            if(player) {
            player.props.isDisconnected = true;
            props.gotAccidentalDisconnect = true;

            if (!player.props.isLost)
                if (props.currentReconnectAttempts++ < props.reconnectAttemptsLimit)
                    configSocket();
                else
                    alert('Failed to reconnect to server. You can still move around, but game might really lag and won\'t really be fun to play.');
            }
            else
                alert('Failed to connect. Please try again.');
        };
    };

    var initGame = function (data) {
        data = data.substring(1).split('^');

        var playerProps = {
            id: parseInt(data[0]),
            xPos: parseInt(data[1]),
            yPos: parseInt(data[2]),
            hue: parseInt(data[3]),
            saturation: parseInt(data[4]),
            alias: data[5]
        };

        entities.player = player = new Player(playerProps, canvasProps, canvasContext);
        stage.translate(-playerProps.xPos, -playerProps.yPos);
        entities.enemies = enemies = new Enemies(stage, player, data[6]);
        entities.foods = foods = new Foods(stage, player, data[7]);
        var perfMonitor = new PerfMonitor(elements.warningBox);
        gameloop = new GameLoop(stage, player, enemies, foods, perfMonitor);
        leaderboard = new Leaderboard(player, enemies);
        chatHandler = new ChatHandler();


        enableGameKeyEvents();
        elements.menuContainer.className = 'remove-m-element';
        elements.scoreContainer.className = 'show-load-text no-user-select';
        elements.leaderboardContainer.className = 'show-load-text no-user-select';
        player.props.isDisconnected = false;
        webSocket.send('L0');
        sendData();
        requestAnimationFrame(gameloop.update);
    };

    var play = function (data) {
        // The data received is in String format.
        // Do not use === for numerical comparisons.
        var message = data.split('^');
        var id = message[0];
        var alias = message[6];

        if (id != player.props.id)
            enemies.update({
                id: id,
                xPos: parseInt(message[1]),
                yPos: parseInt(message[2]),
                score: parseInt(message[3]),
                hue: parseInt(message[4]),
                saturation: parseInt(message[5]),
                alias: alias
            });

        var chatString = message[7];
        if (chatString) {
            chatString = chatString.split('');
            var finalChatStr = '';

            for (var i = 0, len = chatString.length; i < len; i++) {
                var str = chatString[i];
                if (str === '/' && chatString[i + 1] === 'u' && chatString[i + 2] === 'a') {
                    str = '^';
                    i += 2;
                }
                finalChatStr = finalChatStr.concat(str);
            }

            chatHandler.render(alias || '######', finalChatStr);
        }

        if (message[8])
            leaderboard.render(message[8].substring(0, message[8].length - 1));

        if (message[9]) {
            var remIds = message[9].split(',');
            var index = remIds.length;

            while (index--)
                if (remIds[index] == player.props.id) {
                    player.setLost();
                    webSocket.close();
                    elements.aliasRedir.value = player.props.alias;
                    elements.finalScoreRedir.value = player.props.score;
                    elements.gameEndForm.submit();
                } else
                    enemies.remove([remIds[index]]);
        }

        if (message[10])
            foods.update(message[10]);
    };

    var sendData = function () {
        setInterval(function () {
            if (player.props.isDisconnected) {
                clearInterval(this);
                return;
            }

            var up = updatePacket;
            webSocket.send(encode(up));

            up.chatString = '';
            up.remFoods = '';
            up.remPlayers = '';
        }, 32);
    };

    var encode = function (up) {
        var chatString = up.chatString.split('');
        var finalChatStr = '';

        var index = chatString.length;
        while (index--) {
            var str = chatString[index];
            if (str === '^')
                str = '/ua';
            finalChatStr = str.concat(finalChatStr);
        }

        var playerProps = player.props;
        return playerProps.id + '^' + Math.round(playerProps.xPos) + '^' + Math.round(playerProps.yPos) + '^' + playerProps.score + '^' + finalChatStr + '^' + enemies.getUpdateString() + '^' + foods.getUpdateString();
    };

    var getUpdatePacket = function () {
        return updatePacket;
    };

    return {
        configSocket: configSocket,
        getUpdatePacket: getUpdatePacket
    };

});