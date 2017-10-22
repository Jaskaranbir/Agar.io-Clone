var elements = {
    // Persistent Elements (used throughout the game)
    chatDisplay: document.getElementById('g-chat-display'),
    chatField: document.getElementById("g-chat-textfield"),

    leaderboardContainer: document.getElementById('g-leaderboard'),
    leaderboard: document.getElementById('g-leaderboard-names'),
    score: document.getElementById('g-score'),

    warningBox: document.getElementById('g-perf-warning'),


    // Temp Elements (used only at login)
    canvas: document.getElementById("canvas"),
    ctx: document.getElementById("canvas").getContext('2d'),

    chatBox: document.getElementById('g-chat-box'),

    scoreContainer: document.getElementById('g-score-container'),

    aliasField: document.getElementById('m-alias-field'),
    aliasFieldLabel: document.getElementById('m-alias-field-label'),
    aliasForm: document.getElementById('m-alias-form'),

    gameLoadText: document.getElementById('m-game-load-text'),

    menuContainer: document.getElementById('m-container'),
    menuLboard: document.getElementById('m-leaderboard'),
    menuLboardTable: document.getElementById('m-leaderboard-table'),

    closeLboardButton: document.getElementById('m-leaderboard-close-button'),
    openLboardButton: document.getElementById('m-leaderboard-open-button'),
    playButton: document.getElementById('m-play-button'),

    aliasRedir: document.getElementById('g-alias'),
    finalScoreRedir: document.getElementById('g-final-score'),
    gameEndForm: document.getElementById('g-end-form')
};

var mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

//======= The null values are defined after game login in websocket =======

var controls = {
    isPlayerInitialized: false,
    isChatBoxVisible: false,
    socket: null
};

var entities = {
    stage: new Stage(elements.canvas),
    player: null,
    enemies: null,
    foods: null
};