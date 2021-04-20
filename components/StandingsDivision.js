import standingsDivision from "../sass/components/StandingsDivision.module.scss";
import TwitStat from "./TwitStat";
import Empty from "../components/Empty";

function StandingsDivision(props){
    let {division} = props;

    const disabled = (team) => {
        if(props.team){
            return props.team.id !== team.id
        }
        else{
            return false;
        }
    }

    const renderDivision = () => {
        if(!division){
            return null;
        }
        else if(division.length === 0){
            return (
                    <tr>Empty</tr>
                )
        }
        else{
            return division.map((team, index) => {
                return (
                    <TwitStat key={index} team={team} onClick={() => props.onTeamClick(team)} disabled={disabled(team)}/>
                )
            });
        }
        
    }

    const renderCaption = () => {
        if(division[0]){
            return (
                <caption onClick={props.onDivisionClick} className={standingsDivision["standings-division__caption"]}>
                    <span className={standingsDivision["standings-division__caption__text"]}>
                        {division[0].division_name ? division[0].division_name : "Unassigned teams"}
                    </span>
                </caption>
            )
        }
        else{
            return (
                <caption className={standingsDivision["standings-division__caption"]}>
                    <span className={standingsDivision["standings-division__caption__text"]}>
                        New division
                    </span>
                </caption>
            )
        }
        
    }

    return (
        <table className={standingsDivision["standings-division"]}>
            {renderCaption()}
            <thead className={standingsDivision["standings-division__head"]}>
                <tr className={standingsDivision["standings-division__head__row"]}>
                    <th className={standingsDivision["standings-division__head__row__item"]} colSpan={2}>Team</th>
                    <th className={standingsDivision["standings-division__head__row__item"]}>W</th>
                    <th className={standingsDivision["standings-division__head__row__item"]}>L</th>
                    <th className={standingsDivision["standings-division__head__row__item"]}>T</th>
                    <th className={standingsDivision["standings-division__head__row__item"]}>PCT</th>
                    <th className={standingsDivision["standings-division__head__row__item"]}>GB</th>
                </tr>
            </thead>
            <tbody className={standingsDivision["standings__table__body"]}>
                {renderDivision()}
            </tbody>
        </table>
    )
}
export default StandingsDivision;