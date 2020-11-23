import { lolApi } from '@config';
import { MatchQueryDTO } from 'twisted/dist/models-dto';
import { User } from '@models';

const getWinrate = (wins: number, losses: number) => {
    return Math.round((wins / (wins + losses)) * 100);
};

// const getWinsLosses = async (
//     gameIds: number[],
//     lolSummonerName: string,
//     lolRegion: any,
//     championName: string
// ) => {
//     const win_loss = [0, 0];
//     const champion_winrates = {};

//     await Promise.all(
//         gameIds.map(async matchId => {
//             let participantId = 0;
//             const match = await teemoLolApi.matchV4.getMatch(lolRegion, {
//                 path: [matchId],
//             });
//             match['participantIdentities'].forEach(player => {
//                 if (player['player']['summonerName'] === lolSummonerName)
//                     participantId = player['participantId'];
//             });
//             if (participantId <= 5) {
//                 participantId = 0;
//             } else {
//                 participantId = 1;
//             }
//             if (match['teams'][participantId]['win'] == 'Win') {
//                 win_loss[0] += 1;
//                 if (championName in champion_winrates) {
//                     champion_winrates[championName][0] += 1;
//                 } else {
//                     champion_winrates[championName] = [1, 0, 0];
//                 }
//             } else {
//                 win_loss[1] += 1;
//                 if (championName in champion_winrates) {
//                     champion_winrates[championName][1] += 1;
//                 } else {
//                     champion_winrates[championName] = [0, 1, 0];
//                 }
//             }
//             champion_winrates[championName][2] += 1;
//         })
//     );

//     return win_loss;
// };

const getBestMasteryChampions = async (
    summonerMasteries: any,
    accountId: string,
    lolRegion: any
) => {
    return await Promise.all(
        summonerMasteries.response.slice(0, 5).map(async (item: any) => {
            const champion = await lolApi.DataDragon.getChampion(
                item.championId
            );
            const filter: MatchQueryDTO = { champion: item.championId };
            // const gameIds = (
            //     await lolApi.Match.list(accountId, lolRegion, filter)
            // ).response.matches.map(match => match.gameId).
            // const winsLosses = await getWinsLosses(
            //     gameIds,
            //     lolSummonerName,
            //     lolRegion,
            //     champion.name
            // );
            const totalGames = (
                await lolApi.Match.list(accountId, lolRegion, filter)
            ).response.totalGames;
            const championData = await lolApi.DataDragon.getChampion(
                item.championId
            );
            return {
                championName: champion.name,
                championId: item.championId,
                championLevel: item.championLevel,
                championPoints: item.championPoints,
                imageUrl: `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${championData.id}_0.jpg`,
                totalGames,
            };
        })
    );
};

const getRankedInfos = async (id: string, lolRegion: any) => {
    return (await lolApi.League.bySummoner(id, lolRegion)).response.map(
        item => {
            return {
                leagueId: item.leagueId,
                queueType: item.queueType,
                tier: item.tier,
                rank: item.rank,
                leaguePoints: item.leaguePoints,
                wins: item.wins,
                losses: item.losses,
                winrate: getWinrate(item.wins, item.losses),
            };
        }
    );
};

export const getLolStats = async (
    lolSummonerName: string,
    lolRegion: any,
    user: User
) => {
    const accountInfos = await lolApi.Summoner.getByName(
        lolSummonerName,
        lolRegion
    );
    const { id, accountId, puuid } = accountInfos.response;
    const summonerMasteries = await lolApi.Champion.masteryBySummoner(
        id,
        lolRegion
    );
    const overallChampionScore = await lolApi.Champion.championsScore(
        id,
        lolRegion
    );
    const bestMasteryChampions = await getBestMasteryChampions(
        summonerMasteries,
        accountId,
        lolRegion
    );
    const rankedInfos = await getRankedInfos(id, lolRegion);
    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
        },
        summonerName: lolSummonerName,
        id,
        accountId,
        puuid,
        overallChampionScore: overallChampionScore.score,
        bestMasteryChampions,
        rankedInfos,
    };
};
