window.Game = {
    GameManager: null,
    BulletManager: null,
    ItemManager: null,
    PlayerManager: null,
    BattleManager: null,
    GameUtitly: null,
    GlobalsConfig: null,
    GameStand: null,
    player2: null,
    dir: null,
    pos: null,
    m_PlayerPrefab: null,
    m_PlayerPrefab2: null
}

window.GameState = cc.Enum({
    None: 0,
    Pause: 1,
    Play: 2,
    Over: 3
})

window.DirectState = cc.Enum({
    None: 0,
    Left: 1,
    Right: 2
})

window.GLB = {
    RANDOM_MATCH: 1,
    PROPERTY_MATCH: 2,
    COOPERATION: 1,
    COMPETITION: 2,
    MAX_PLAYER_COUNT: 2,

    PLAYER_COUNTS: [2],

    GAME_START_EVENT: "gameStart",
    GAME_OVER_EVENT: "gameOver",
    READY: "ready",
    ROUND_START: "roundStar",
    SCORE_EVENT: "score",
    SHOOT_GUN_ITEM: "shootGunItem",
    FIRE: "fire",
    DIRECTION: "direction",
    SPAWN_SLATE: "slateSpawn",
    HURT: "hurt",
    ITEM_GET: "itemGet",
    SLATE_HITTING: "SlateHitting",

    channel: 'MatchVS',
    platform: 'alpha',
    gameId: 201553,
    gameVersion: 1,
    IP: "wxrank.matchvs.com",
    PORT: "3010",
    GAME_NAME: "game5",
    appKey: 'e4ec6e88380843ed89f4e6327b333752',
    secret: 'dd9a27fe64894f12863b189570451474',

    matchType: 1,
    gameType: 2,
    userInfo: null,
    playerUserIds: [],
    isRoomOwner: false,

    syncFrame: true,
    FRAME_RATE: 10,

    NormalBulletSpeed: 1000,
    limitX: 415
}
