var Stage = (function (canvasElement) {
    var ctx = canvasElement.getContext('2d');
    var props = {};
    var scrSizeRatio;

    var setWindowProps = function () {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

        props['screenCenterX'] = window.innerWidth / 2;
        props['screenCenterY'] = window.innerHeight / 2;
        scrSizeRatio = window.innerWidth / window.innerHeight;
        props['scrRatio'] = (scrSizeRatio < 1 ? 1 / scrSizeRatio : scrSizeRatio) * 0.5;

        props['gridSize'] = window.innerHeight / 18 * props.scrRatio;
        // Plus one so it doesn't seem like screen edge lacks grid line
        props['numGridLinesHori'] = parseInt(window.innerWidth / (props.gridSize * props.scrRatio)) + 1;
        props['numGridLinesVert'] = parseInt(window.innerHeight / (props.gridSize * props.scrRatio)) + 1;
    };

    var drawGrid = function (playerXVel, playerYVel) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        translate(playerXVel, playerYVel);
        
        var fs = props.finalScale;
        var gs = props.gridSize * fs;

        ctx.beginPath();
        ctx.strokeStyle = "#C3CACD";
        ctx.lineWidth = 1;
        
        for (var x = (props.xOff * fs); x <  window.innerWidth; x += gs) {
            if(x < 0)
                continue;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, window.innerHeight);
        }
        for (x = (props.yOff * fs); x <  window.innerHeight; x += gs) {
            if(x < 0)
                continue;
            ctx.moveTo(0, x);
            ctx.lineTo(window.innerWidth, x);
        }
        
        ctx.stroke();
        ctx.closePath();
    };
    
    var translate = function (xOff, yOff) {        
        props.xOff += xOff;
        props.yOff += yOff;
    };

    (function () {
        setWindowProps();
        props['autoScaleFactor'] = 1;
        props['autoScaleCounter'] = 0;
        props['zoom'] = 1;
        props['finalScale'] = props.scrRatio;

        props['xOff'] = 0;
        props['yOff'] = 0;

        props['cRadian'] = Math.PI * 2;

        drawGrid(0, 0);
    })();

    var setScaleFactor = function () {
        var factor = parseInt(props.autoScaleCounter / 90);

        props.autoScaleFactor -= (0.0053 * factor);
        props.autoScaleCounter -= (90 * factor);
        props.finalScale = props.autoScaleFactor * props.scrRatio;

        props.gridSize = window.innerHeight / 18 * props.scrRatio;

        var scaledGridSize = props.gridSize * props.finalScale;
        props.numGridLinesHori = window.innerWidth / scaledGridSize;
        props.numGridLinesVert = window.innerHeight / scaledGridSize;

        return factor;
    };

    var incrementScaleCounter = function (amount) {
        props.autoScaleCounter += amount || 1;
        return (props.autoScaleCounter > 89 && props.autoScaleFactor * props.scrRatio > 0.2) ? setScaleFactor() : 0;
    };

    var resize = function () {
        setWindowProps();
        setScaleFactor();
        drawGrid(0, 0);
    };

    var zoom = function (scale) {
        var zoomDelta = props.zoom + scale;
        if (zoomDelta > 1 && zoomDelta < 2) {
            props.zoom = zoomDelta;
            
            ctx.restore();
            ctx.save();
            ctx.translate(props.screenCenterX, props.screenCenterY);
            ctx.scale(zoomDelta, zoomDelta);
            ctx.translate(-props.screenCenterX, -props.screenCenterY);
        }
    };

    return {
        context: ctx,
        draw: drawGrid,
        incrementScaleCounter: incrementScaleCounter,
        props: props,
        resize: resize,
        translate: translate,
        zoom: zoom
    };
});