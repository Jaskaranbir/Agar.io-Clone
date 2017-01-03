var Foods = (function (stage, player, foodDataString) {
    var foodsArray = [];
    var props = {};
    var updateString = '';
    
    var canvasProps = stage.props;

    var playerProps = player.props;
    var canvasContext = stage.context;

    var setSize = function () {
        var scale = canvasProps.finalScale * canvasProps.zoom;

        if (scale > 1.3)
            props.sides = 11;
        else if (scale > 1)
            props.sides = 9;
        else if (scale > 0.8)
            props.sides = 7;
        else if (scale > 0.6)
            props.sides = 6;
        else if (scale > 0.35)
            props.sides = 5;
        else
            props.sides = -1;

        var angle = Math.PI * 2 / props.sides;

        var radius1 = props.radius1 * canvasProps.finalScale;
        var radius2 = props.radius2 * canvasProps.finalScale;
        var cellSize = props.foodSize;
        var altCellSize = props.altFoodSize;
        for (var i = 0, sides = props.sides; i <= sides; i++) {
            cellSize[i] = [radius1 * Math.cos(i * angle), radius2 * Math.sin(i * angle)];
            altCellSize[i] = [radius2 * Math.cos(i * angle), radius1 * Math.sin(i * angle)];
        }
    };

    (function () {
        props['radius1'] = 16;
        props['radius2'] = 15.4;
        props['foodSize'] = [];
        props['altFoodSize'] = [];
        props['sizeSwitchCounter'] = 0;
        props['sides'] = 5;
        setSize();

        var foods = foodDataString.split('|');
        for (var i = 0; i < foods.length; i++) {
            var f = foods[i].split(',');
            foodsArray.push({
                id: f[0],
                xPos: f[1],
                yPos: f[2],
                red: f[3],
                green: f[4],
                blue: f[5]
            });
        }
    })();

    var draw = function () {
        var foodSize = props.sizeSwitchCounter++ < 15 ? props.altFoodSize : props.foodSize;
        if (props.sizeSwitchCounter === 30)
            props.sizeSwitchCounter = 0;

        var scale = canvasProps.finalScale;
        var index = foodsArray.length;
        var pr = playerProps.radius;
        var prsq = pr * pr;

        while (index--) {
            var food = foodsArray[index];

            if (!food || Math.abs(playerProps.xPos - food.xPos) * scale > canvasProps.screenCenterX || Math.abs(playerProps.yPos - food.yPos) * scale > canvasProps.screenCenterY)
                continue;

            var dX = Math.abs(food.xPos - playerProps.xPos);
            var dY = Math.abs(food.yPos - playerProps.yPos);

            if (dX < pr && dY < pr && ((dX * dX) + (dY * dY) < prsq)) {
                removeFood(index);
                continue;
            }
            var xPos = food.xPos * scale;
            var yPos = food.yPos * scale;
            var relX = (xPos + playerProps.centerXDist);
            var relY = (yPos + playerProps.centerYDist);

            var ctx = canvasContext;
            ctx.beginPath();
            ctx.moveTo(relX + foodSize[0][0], relY + foodSize[0][1]);
            if (props.sides === -1) {
                ctx.arc(relX, relY, props.rad1 * scale, 0, props.cRadian, false);
            } else
                for (var i = 1, len = props.sides; i <= len; i++) {
                    var cd = foodSize[i];
                    ctx.lineTo(relX + cd[0], relY + cd[1]);
                }
            ctx.fillStyle = "rgb(" + food.red + "," + food.green + "," + food.blue + ")";
            ctx.fill();
            ctx.closePath();
        }
    };

    var removeFood = function (id) {
        updateString += id + ',';
        var food = foodsArray[id];
        var hs = rgbToHueSat(food.red, food.green, food.blue);
        foodsArray[id] = null;

        var statsDelta = 1;
        var velFactor = stage.incrementScaleCounter(statsDelta);
        player.consumeFood(hs[0], hs[1], velFactor);
    };

    var update = function (updateMessage) {
        var foods = updateMessage.split('|');

        for (var i = 0; i < foods.length; i++) {
            var food = foods[i].split(',');
            foodsArray[food[0]] = {
                id: food[0],
                xPos: food[1],
                yPos: food[2],
                red: food[3],
                green: food[4],
                blue: food[5]
            };
        }
    };

    var rgbToHueSat = function (red, green, blue) {
        red /= 255;
        green /= 255;
        blue /= 255;

        if (red === green === blue)
            red += red < 253 ? 1 : -1;

        var max = Math.max(red, green, blue);
        var min = Math.min(red, green, blue);
        var diff = max - min;

        var hue;
        switch (max) {
            case red:
                hue = (green - blue) / diff;
                break;
            case green:
                hue = 2 + (blue - red) / diff;
                break;
            default:
                hue = 4 + (red - green) / diff;
        }

        hue *= 60;
        if (hue < 0)
            hue += 360;

        var sat = diff / (max + min) * 100;
        return [Math.round(hue), sat];
    };
    
    var getUpdateString = function () {
        var str = updateString.substring(0, updateString.length - 1);
        updateString = '';
        return str;
    };

    return {
        draw: draw,
        update: update,
        updateSize: setSize,
        getUpdateString: getUpdateString
    };
});