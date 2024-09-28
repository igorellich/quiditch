import { IActor } from "../base/Actor/IActor";

export class Team{
    private _members: IActor[] = [];
    private readonly _id:string;
    constructor(id: string){
        this._id = id;

    }
    public AddMember(member:IActor){
        if(!this._members.includes(member)){
            this._members.push(member);
        }
    }
    public RemoveMember(member: IActor) {
        const index = this._members.indexOf(member);
        if (index >= 0) {
            this._members.splice(index, 1);
        }
    }
    public isActorInTeam(actor:IActor):boolean{
        return this._members.includes(actor);
    }
}