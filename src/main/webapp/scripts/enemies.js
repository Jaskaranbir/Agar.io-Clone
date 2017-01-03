var Enemies = (function (stage, player, enemyDataString) {

    var props = {
        enemiesArray: [],
        opdata: []   
    };
    
    var playerProps = player.props;
    var canvasContext = stage.context;
    var canvasProp = stage.props;
    var lastUpdatedId = -1;
    var updateString = '';

    (function () {
        var enemies = enemyDataString.split('|');
        for (var i = 0; i < enemies.length; i++) {
            var p = enemies[i].split(',');
            if (p[0] == playerProps.id)
                props.enemiesArray.push(null);
            else
                props.enemiesArray.push({
                    id: parseInt(p[0]),
                    xPos: parseInt(p[1]),
                    yPos: parseInt(p[2]),
                    score: parseInt(p[3]),
                    hue: parseInt(p[4]),
                    saturation: parseInt(p[5]),
                    alias: p[6]
                });
        }
    })();

    var draw = function () {
        var index = props.enemiesArray.length;
        var ctx = canvasContext;

        while (index--) {
            ctx.lineWidth = 8 * canvasProp.finalScale;

            // new player-data
            var npdata = props.enemiesArray[index];
            if (!npdata)
                continue;

            // old player-data
            var e = props.opdata[index];

            if (e) {
                if (lastUpdatedId === e.id) {
                    e.xDiff = npdata.xPos - e.xPos;
                    e.yDiff = npdata.yPos - e.yPos;
                    lastId = -1;
                } else {
                    xDiff = npdata.xPos - e.xPos;
                    yDiff = npdata.yPos - e.yPos;
                    e.xDiff += (xDiff - e.xDiff) * 0.2;
                    e.yDiff += (yDiff - e.yDiff) * 0.2;
                }

                e.xPos += (e.xDiff * 0.22);
                e.yPos += (e.yDiff * 0.22);
            } else
                props.opdata[index] = e = {
                    xPos: npdata.xPos,
                    yPos: npdata.yPos,
                    xDiff: 0,
                    yDiff: 0
                };

            var xPosScaled = e.xPos * canvasProp.finalScale;
            var yPosScaled = e.yPos * canvasProp.finalScale;
            var relxPos = xPosScaled + playerProps.centerXDist;
            var relyPos = yPosScaled + playerProps.centerYDist;

            var radius = Math.ceil(npdata.score * 0.102) + 26;

            ctx.beginPath();
            ctx.arc(relxPos, relyPos, (radius * canvasProp.finalScale), 0, canvasProp.cRadian, false);
            ctx.fillStyle = 'hsl(' + npdata.hue + ", " + npdata.saturation + "%, " + playerProps.lumination + "%)";
            ctx.fill();
            ctx.strokeStyle = 'hsl(' + npdata.hue + ", " + npdata.saturation + "%, " + (playerProps.lumination - 20) + "%)";
            ctx.stroke();
            ctx.closePath();

            ctx.lineWidth = 1;

            ctx.font = "bold 30px Roboto";
            var alias = npdata.alias;
            var xPos_alias_diff = relxPos - (ctx.measureText(alias).width / 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(npdata.alias, xPos_alias_diff, relyPos);
            ctx.strokeStyle = '#000000';
            ctx.strokeText(npdata.alias, xPos_alias_diff, relyPos);

            ctx.font = "bold 23px Roboto";
            var score = npdata.score;
            var xPos_score_diff = relxPos - (ctx.measureText(score).width / 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(score, xPos_score_diff, relyPos + 27);
            ctx.strokeStyle = '#000000';
            ctx.strokeText(score, xPos_score_diff, relyPos + 27);

            // Player-Enemy (pe) Calculations
            var peXDiff = Math.abs(e.xPos - playerProps.xPos);
            var peYDiff = Math.abs(e.yPos - playerProps.yPos);
            var totalRadius = (radius + playerProps.radius);
            var qTotalRadius = playerProps.radius > radius ? radius : playerProps.radius;

            var radDiff = totalRadius - qTotalRadius;
            var xDiff = e.xPos - playerProps.xPos;
            var yDiff = e.yPos - playerProps.yPos;
            if (peXDiff < radDiff && peYDiff < radDiff && playerProps.score > (npdata.score + 2) && (xDiff * xDiff) + (yDiff * yDiff) < radDiff * radDiff)
                remove(npdata.id, true);
        }
    };

    var update = function (updateProps) {
        var id = updateProps.id;
        lastUpdatedId = id;

        props.enemiesArray[id] = {
            alias: updateProps.alias,
            id: id,
            xPos: updateProps.xPos,
            yPos: updateProps.yPos,
            score: updateProps.score,
            hue: updateProps.hue,
            saturation: updateProps.saturation
        };
    };
    
    var remove = function (id, playerConsumed) {
        if(playerConsumed) {
            updateString += id + ',';
            var statsDelta = Math.ceil((props.enemiesArray[id].score + 26) / 4);
            var velFactor = stage.incrementScaleCounter(statsDelta);
            player.consumeEnemy(statsDelta, velFactor);
        }
        props.enemiesArray[id] = null;
    };
    
    var getUpdateString = function () {
        var str = updateString.substring(0, updateString.length - 1);
        updateString = '';
        return str;
    };

    return {
        draw: draw,
        update: update,
        remove: remove,
        enemies: props.enemiesArray,
        getUpdateString: getUpdateString
    };
});