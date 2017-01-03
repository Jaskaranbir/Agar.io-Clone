var ChatHandler = (function () {
    
    var chatHistoryLimit = 100;
    
    var ChatItem = React.createClass({
        render: function () {
            return (
                    React.createElement('div', {className: 'break-word'},
                            React.createElement('span', {className: 'bold-text'}, this.props.cName + ':\u00a0'),
                            this.props.cMessage)
                    );
        }
    });

    var ChatBox = React.createClass({
        getInitialState: function () {
            return {
                messages: [{
                        cName: this.props.cName,
                        cMessage: this.props.cMessage
                    }],
                messageKey: 0
            };
        },
        componentWillReceiveProps: function () {
            var m = this.state.messages.slice();

            m.push({
                cName: this.props.cName,
                cMessage: this.props.cMessage
            });
            if (m.length > chatHistoryLimit)
                m.shift();

            this.setState({
                messages: m,
                messageKey: ++this.state.messageKey
            });
        },
        render: function () {
            var x = this.state.messages;
            x[x.length - 1] = React.createElement(ChatItem, {
                cName: this.props.cName,
                cMessage: this.props.cMessage,
                key: this.state.messageKey
            });

            return (
                    React.createElement('div', {}, this.state.messages));
        }
    });

    var render = function (cName, cMessage) {
        ReactDOM.render(React.createElement(ChatBox, {cName: cName, cMessage: cMessage}), elements.chatDisplay);
    };
    
    return {
        render: render
    };
});