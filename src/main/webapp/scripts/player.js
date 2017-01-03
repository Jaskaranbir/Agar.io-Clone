var Player = (function (playerProps, canvasProps, canvasContext) {
    var props = {};

    (function () {
        props['id'] = playerProps.id || 0;
        props['alias'] = playerProps.alias || '';

        props['xPos'] = playerProps.xPos || 0;
        props['yPos'] = playerProps.yPos || 0;

        props['hue'] = playerProps.hue || 50;
        props['saturation'] = playerProps.saturation || 50;
        props['lumination'] = 46;
        props['color'] = 'hsl(' + props.hue + ', ' + props.saturation + '%, ' + props.lumination + '%)';
        props['color_border'] = 'hsl(' + props.hue + ', ' + props.saturation + '%, ' + (props.lumination - 20) + '%)';

        props['baseVel'] = 5.8;
        props['score'] = 0;
        props['radius'] = 26;
        props['radiusIncCounter'] = 0;
        props['colorSwitchEffectRadius'] = 0;
        props['xVel'] = 0;
        props['yVel'] = 0;
        props['isColorSwitchMode'] = false;
        props['isDisconnected'] = false;
        props['isLost'] = false;
        props['centerXDist'] = canvasProps.screenCenterX || window.innerWidth / 2;
        props['centerYDist'] = canvasProps.screenCenterY || window.innerHeight / 2;
    })();

    var move = function (mouseX, mouseY, fpsFactor) {
        var cp = canvasProps;

        var xDiff = mouseX - cp.screenCenterX;
        var yDiff = mouseY - cp.screenCenterY;
        var deg = Math.atan2(yDiff, xDiff);
        var xDiffAbs = Math.abs(xDiff);
        var yDiffAbs = Math.abs(yDiff);

        var radiusScaled = props.radius * cp.finalScale;

        // Used to slow down player when mouse inside the player circle
        var centerDistVel = (xDiffAbs < radiusScaled && yDiffAbs < radiusScaled && Math.hypot(xDiffAbs, yDiffAbs) < radiusScaled) ? Math.min(xDiffAbs / (30 * cp.finalScale), 1) : 1;
        var velAdjust = centerDistVel * fpsFactor;
        var xVel = Math.cos(deg) * velAdjust;
        var yVel = Math.sin(deg) * velAdjust;

        props.xVel = xVel * props.baseVel;
        props.yVel = yVel * props.baseVel;

        var newXPos = (props.xPos + props.xVel);
        var newYPos = (props.yPos + props.yVel);
        if (newXPos > 0 && newXPos < 14143)
            props.xPos = newXPos;
        else
            props.xVel = 0;
        
        if (newYPos > 0 && newYPos < 14143)
            props.yPos = newYPos;
        else
            props.yVel = 0;
            
        // These need to be calculated every time
        // To cover cases like player trying to go out of bounds while resizing screen
        props.centerXDist = cp.screenCenterX - (props.xPos * cp.finalScale);
        props.centerYDist = cp.screenCenterY - (props.yPos * cp.finalScale);
    };

    var draw = function () {
        var cp = canvasProps;
        var ctx = canvasContext;
        var radiusScaled = props.radius * cp.finalScale;

        drawColorChangeEffect(ctx, cp, radiusScaled);

        ctx.lineWidth = 8 * cp.finalScale;
        ctx.beginPath();
        ctx.arc(cp.screenCenterX, cp.screenCenterY, radiusScaled, 0, cp.cRadian, false);
        ctx.fillStyle = props.color;
        ctx.fill();
        ctx.strokeStyle = props.color_border;
        ctx.stroke();
        ctx.closePath();

        // Draw alias and score text
        ctx.lineWidth = 1;

        ctx.font = "bold 30px Roboto";
        var alias = props.alias;
        var aliasWidth = ctx.measureText(alias).width / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(alias, cp.screenCenterX - (aliasWidth), cp.screenCenterY);
        ctx.strokeStyle = '#000000';
        ctx.strokeText(alias, cp.screenCenterX - (aliasWidth), cp.screenCenterY);

        ctx.font = "bold 23px Roboto";
        var score = props.score;
        var scoreWidth = ctx.measureText(score).width / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(score, cp.screenCenterX - (scoreWidth), cp.screenCenterY + 27);
        ctx.strokeStyle = '#000000';
        ctx.strokeText(score, cp.screenCenterX - (scoreWidth), cp.screenCenterY + 27);
    };

    var drawColorChangeEffect = function (ctx, cp, radiusScaled) {
        if (props.colorSwitchEffectRadius > 1) {
            ctx.beginPath();

            var gradient = ctx.createRadialGradient(cp.screenCenterX, cp.screenCenterY, (radiusScaled) + 45, cp.screenCenterX, cp.screenCenterY, radiusScaled);

            gradient.addColorStop(0, props.color);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');

            if (props.isColorSwitchMode && props.colorSwitchEffectRadius < radiusScaled + 26)
                props.colorSwitchEffectRadius += 4;

            ctx.arc(cp.screenCenterX, cp.screenCenterY, --props.colorSwitchEffectRadius, 0, cp.cRadian, false);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.closePath();
        }
    };

    var switchColor = function (hue, saturation) {
        if (props.isColorSwitchMode) {
            props.isColorSwitchMode = false;
            props.hue = hue;
            props.saturation = saturation;
            props.color = "hsl(" + hue + ", " + saturation + "%, " + props.lumination + "%)";
            props.color_border = "hsl(" + hue + ", " + saturation + "%, " + (props.lumination - 20) + "%)";
        }
    };
    
    var consumeFood = function (foodHue, foodSaturation, velScaleFactor) {
        props.radiusIncCounter += 0.102;
        if (props.radiusIncCounter > 1) {
            props.radius++;
            props.radiusIncCounter -= 1;
        }
        props.score++;
        switchColor(foodHue, foodSaturation);
        scaleVel(velScaleFactor);
    };
    
    var consumeEnemy = function (statsDelta, velScaleFactor) {
        props.score += statsDelta;
        props.radius += Math.ceil(statsDelta * 0.102);
        props.colorSwitchEffectRadius = (props.radius * canvasProps.finalScale) + 26;
        
        scaleVel(velScaleFactor);
    };
    
    var scaleVel = function (factor) {
        if(props.baseVel > 0.1)
            props.baseVel -= (0.05 * factor);
    };
    
    var setLost = function () {
        props.isLost = true;
        props.isDisconnected = true;
    };

    return {
        draw: draw,
        consumeFood: consumeFood,
        consumeEnemy: consumeEnemy,
        move: move,
        switchColor: switchColor,
        setLost: setLost,
        props: props
    };
});