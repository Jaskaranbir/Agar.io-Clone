window.addEventListener("resize", function () {
    entities.stage.resize();
    if (entities.foods)
        entities.foods.updateSize();
});

document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('wheel', function (e) {
    var d = e.deltaY;
    if (d > 6 || d < -6) {
        entities.stage.zoom(d < 0 ? -0.005 : 0.005);
        if (entities.foods)
            entities.foods.updateSize();
    }
});

elements.chatField.addEventListener('paste', function (e) {
    e.preventDefault();
});

elements.chatField.addEventListener('focus', function () {
    elements.chatField.className = 'g-chat-textfield-focused';
});

elements.chatField.addEventListener('blur', function () {
    elements.chatField.className = '';
});

elements.chatField.addEventListener('keydown', function (e) {
    if (elements.chatField.value.length > 250 && e.code !== 'Backspace')
        e.preventDefault();
});

elements.aliasField.addEventListener('keydown', function (e) {
    if (elements.aliasField.value.length > 14 && e.code !== 'Backspace')
        e.preventDefault();
    else if (e.code === "Enter")
        elements.playButton.click();
});

elements.playButton.addEventListener('click', function () {
    elements.aliasField.blur();
    var pName = elements.aliasField.value;

    if (pName.length > 15) {
        elements.aliasFieldLabel.textContent = 'Alias too long.';
        elements.aliasFieldLabel.className = 'red-text';
        elements.aliasFieldLabel.focus();
    }
    else if (pName.includes('^')) {
        elements.aliasFieldLabel.textContent = 'Alias cannot include character "^".';
        elements.aliasFieldLabel.className = 'red-text';
        elements.aliasFieldLabel.focus();
    }
    else {
        controls.socket = new Socket(entities.stage, pName);
        controls.socket.configSocket();
        elements.aliasForm.className = 'remove-m-element';
        elements.gameLoadText.className = 'show-load-text';
    }
});

elements.openLboardButton.addEventListener('click', function () {
    elements.aliasForm.className += ' m-alias-form-fade';
    if (!document.querySelector('#' + elements.menuLboardTable.id + ' td')) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'GetLboard');
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var data = xhr.responseText;
                if (data.length === 0)
                    data = '^^No player data available^No score data available';
                data = data.split('^^');

                elements.menuLboard.className = 'show-m-leaderboard';

                for (var i = 0; i < data.length; i++) {
                    var idata = data[i].split('^');
                    var row = document.createElement('tr');
                    var cell = document.createElement('td');
                    cell.textContent = idata[0];
                    row.appendChild(cell);
                    cell = document.createElement('td');
                    cell.textContent = idata[1];
                    row.appendChild(cell);
                    elements.menuLboardTable.appendChild(row);
                }
            }
        };
    } else
        elements.menuLboard.className = 'show-m-leaderboard';
});

elements.closeLboardButton.addEventListener('click', function () {
    elements.menuLboard.className = 'hide-m-leaderboard';
    elements.aliasField.focus();
    elements.aliasForm.className = elements.aliasForm.className.replace('m-alias-form-fade', '');

});

 document.addEventListener("keydown", function (e) {
    if (controls.isPlayerInitialized) {
        var playerProps = entities.player.props;
        var canvasProps = entities.stage.props;
        var chatField = elements.chatField;
        var chatFieldSelected = document.activeElement === chatField;

        if (e.code === "KeyC" && !chatFieldSelected && playerProps) {
            playerProps.isColorSwitchMode = !playerProps.isColorSwitchMode;
            if (playerProps.isColorSwitchMode)
                playerProps.colorSwitchEffectRadius = playerProps.radius * canvasProps.finalScale;
        }

        else if (e.code === "KeyT" && !playerProps.isDisconnected) {
            if (!controls.isChatBoxVisible) {
                elements.chatBox.className = '';
                controls.isChatBoxVisible = true;
                setTimeout(function () {
                    chatField.focus();
                }, 400);
            }
            else
                chatField.focus();

            if (!chatFieldSelected)
                e.preventDefault();
        }

        else if (e.code === "Escape" && chatFieldSelected)
            chatField.blur();

        else if (chatFieldSelected && e.code === "Enter") {
            controls.socket.getUpdatePacket().chatString = chatField.value;
            chatField.value = '';
        }

        if (!chatFieldSelected && e.code === "KeyQ") {
            elements.chatBox.className = controls.isChatBoxVisible ? 'g-chat-box-hidden' : '';
        controls.isChatBoxVisible = !controls.isChatBoxVisible;
        }
    }
});