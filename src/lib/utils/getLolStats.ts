import { lolApi } from '@config';
import { MatchQueryDTO } from 'twisted/dist/models-dto';
import { User } from '@models';

const getWinrate = (wins: number, losses: number) => {
    return Math.round((wins / (wins + losses)) * 100);
};

const getBestMasteryChampions = async (
    // tslint:disable-next-line: no-any
    summonerMasteries: any,
    accountId: string,
    // tslint:disable-next-line: no-any
    lolRegion: any
) => {
    // tslint:disable-next-line: no-return-await
    return await Promise.all(
        // tslint:disable-next-line: no-any
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

// tslint:disable-next-line: no-any
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

interface IAccountData {
    id?: string;
    accountId?: string;
    puuid?: string;
    summonerLevel?: number;
}

const statsv2 = async (accountData: IAccountData, response: Object) => {
    accountData;
    response;
};

export const getLolStats = async (
    lolSummonerName: string,
    // tslint:disable-next-line: no-any
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

    // Response formatting
    let response: Object = {
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

    // Stats v2
    const accountData: IAccountData = {
        id: accountInfos.response.id,
        accountId: accountInfos.response.accountId,
        puuid: accountInfos.response.puuid,
        summonerLevel: accountInfos.response.summonerLevel,
    };

    response = await statsv2(accountData, response);

    return response;
};
