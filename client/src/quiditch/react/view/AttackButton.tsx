import * as React from "react"

export const AttackButton = (props: {
    callback: (evt: any) => void
}) => {

    return <div onClick={props.callback} className="attack">

    </div>
}