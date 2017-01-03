var GameLoop = (function (stage, player, enemies, foods, perfMonitor) {
    var playerProps = player.props;

    var update = function () {
        var fpsFactor = perfMonitor.getPerfFactor();
        player.move(mouse.x, mouse.y, fpsFactor);
        stage.draw(-playerProps.xVel, -playerProps.yVel);
        enemies.draw();
        foods.draw();
        player.draw();
        requestAnimationFrame(update);
    };

    return {
        update: update
    };

});