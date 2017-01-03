<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="WEB-INF/tlds/score_comm.tld" prefix="m" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Game Results</title>
        <link rel="shortcut icon" type="image/png" href="images/favicon.png"/>
        <link href="https://fonts.googleapis.com/css?family=Baloo" rel="stylesheet">
        <link rel='stylesheet' href='styles/result.css'>
    </head>
    <body>
        <canvas id="canvas"></canvas>
        <div id="wrapper">
            <div id="game-over-text">Game Over!</div>
            <div id="score-text">Score: <c:out value="${score}" /></div>
            <div id='comment-text'><m:ScoreComment score="${score}" /></div>
        </div>

        <script type="text/javascript" src="scripts/stage.js"></script>
        
        <script>
            var canvas = document.getElementById("canvas");
            var stage = new Stage(canvas);

            window.addEventListener("resize", function () {
                stage.resize();
            });
            
            document.addEventListener("click", function () {
                window.location.replace("index.html");
            });
        </script>
    </body>
</html>
