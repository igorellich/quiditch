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
    'attack' = 'attack'
}
export enum ActorNames{
    "quaffle"="quaffle",
    "gates"="gates",
    "player"="player"
}
export type KeyboardInputMap={
    [action in GameInputActions]: string[]
}