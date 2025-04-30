export enum CollisionGroups {
    "wall"=1,
    "character"=2,
    "gates"=4,
    "ball"=3
}   
export enum GameInputActions {
    "moveForward" = "moveForward",
    'moveBackward' = 'moveBackward',
    'turnLeft' = 'turnLeft',
    'turnRight' = 'turnRight',
    'attack' = 'attack',
    'pause' = 'pause'
}
export enum ActorNames {
    "quaffle" = "quaffle",
    "gates" = "gates",
    "player" = "player",
    "pointer" = "pointer",
    "walls" = "walls",
    ground = "ground"
}
export type KeyboardInputMap={
    [action in GameInputActions]: {
        keys:string[],
        single?:boolean
    }
}