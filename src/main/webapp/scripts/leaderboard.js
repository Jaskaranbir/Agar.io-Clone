var Leaderboard = (function (player, enemies) {
    var playerProps = player.props;
    var enemiesArray = enemies.enemies;

    var BoardRow = React.createClass({
        render: function () {
            return (
                    React.createElement('li', {className: this.props.className}, !this.props.alias.trim() ? 'An unnamed cell' : this.props.alias)
                    );
        }
    });

    var Board = React.createClass({
        getInitialState: function () {
            return {
                pClass: 'red-text',
                class: ''
            };
        },
        render: function () {
            var self = this.state;
            
            var ids = this.props.ids.map(function (e) {
                if (e == playerProps.id)
                    return React.createElement(BoardRow, {className: self.pClass, alias: playerProps.alias, key: playerProps.id});

                var enemy = enemiesArray[e];
                if (enemy)
                    return React.createElement(BoardRow, {className: self.class, alias: enemy.alias, key: e});
            });

            return (
                    React.createElement('ul', {}, ids)
                    );
        }
    });

    // Leaderboard position = Player IDs
    var renderBoard = function (ids) {
        ids = ids.split(',');
        ReactDOM.render(React.createElement(Board, {ids: ids}), elements.leaderboard);
    };

    return {
        render: renderBoard
    };
});