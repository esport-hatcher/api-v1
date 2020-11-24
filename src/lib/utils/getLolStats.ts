import { lolApi } from '@config';
import {
    MatchQueryDTO,
    ApiResponseDTO,
    MatchDto,
    MatchParticipantDTO,
    MatchTeamsDto,
} from 'twisted/dist/models-dto';
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
    // tslint:disable-next-line: no-any
    region?: any;
}

interface IMatchList {
    gameId?: number;
    platformId?: string;
    champion?: number;
    lane?: string;
}

interface IMatchData {
    matchInfo?: IMatchList;
    gameDuration?: number;
    win?: boolean;
    kills?: number;
    deaths?: number;
    assists?: number;
    totalMinionsKilled?: number;
    totalDamageDealt?: number;
    totalHeal?: number;
    longestTimeSpentLiving?: number;
    visionScore?: number;
    visionWardsBoughtInGame?: number;
    goldEarned?: number;
    champLevel?: number;
    turretKills?: number;
    inhibitorKills?: number;
    levelPerMinutes?: number;
    csPerMinutes?: number;
}

async function fetchPlayerRecentGames(
    accountData: IAccountData
): Promise<IMatchList[]> {
    const matchFilter: MatchQueryDTO = {
        queue: 420,
        beginIndex: 0,
        endIndex: 100,
    };
    const playerMatches = await lolApi.Match.list(
        accountData.accountId,
        accountData.region,
        matchFilter
    );

    if (playerMatches.response.totalGames <= 9) {
        return [];
    }

    const matchList: IMatchList[] = [];
    playerMatches.response.matches.forEach(function (match, index) {
        if (index < 10) {
            const newMatch: IMatchList = {
                gameId: match.gameId,
                platformId: match.platformId,
                champion: match.champion,
                lane: match.lane,
            };

            matchList.push(newMatch);
        }
    });

    return matchList;
}

function fetchUserInfos(
    accountData: IAccountData,
    matchData: ApiResponseDTO<MatchDto>
): MatchParticipantDTO {
    for (let i = 0; i < matchData.response.participantIdentities.length; ++i) {
        if (
            matchData.response.participantIdentities[i].player
                .currentAccountId == accountData.accountId
        ) {
            return matchData.response.participants[
                matchData.response.participantIdentities[i].participantId - 1
            ];
        }
    }

    return {} as MatchParticipantDTO;
}

function fetchMatchResult(teams: MatchTeamsDto[], teamId: number): boolean {
    for (let i = 0; i < teams.length; ++i) {
        if (teamId == teams[i].teamId) {
            return teams[i].win;
        }
    }

    return false;
}

function calcAverage(matchList: IMatchData[]): Object {
    const fields: string[] = [
        'gameDuration',
        'kills',
        'deaths',
        'assists',
        'totalMinionsKilled',
        'totalDamageDealt',
        'totalHeal',
        'longestTimeSpentLiving',
        'visionScore',
        'visionWardsBoughtInGame',
        'goldEarned',
        'champLevel',
        'turretKills',
        'inhibitorKills',
        'levelPerMinutes',
        'csPerMinutes',
    ];
    const analytics = {};

    fields.forEach(function (field) {
        let fieldAverage = 0;

        matchList.forEach(function (match) {
            fieldAverage += match[field];
        });

        analytics[field] =
            Math.round((fieldAverage / matchList.length) * 10) / 10;
    });

    return analytics;
}

function getDataMostOccurences(dataList: IMatchData[], field: string): string {
    const countTable: Object = {};

    for (let i = 0; i < dataList.length; ++i) {
        if (countTable[dataList[i].matchInfo[field]] != null) {
            ++countTable[dataList[i].matchInfo[field]];
        } else {
            countTable[dataList[i].matchInfo[field]] = 1;
        }
    }

    let topElement = null;
    Object.keys(countTable).forEach(function (element) {
        if (topElement == null) {
            topElement = element;
        }

        if (countTable[element] > countTable[topElement]) {
            topElement = element;
        }
    });

    return topElement;
}

function calcAverageKda(advancedStats: Object): number {
    return (
        Math.round(
            ((advancedStats['kills'] + advancedStats['assists']) /
                advancedStats['deaths']) *
                10
        ) / 10
    );
}

async function statsv2(accountData: IAccountData): Promise<Object> {
    let response: Object = {};
    const matchIds: IMatchList[] = await fetchPlayerRecentGames(accountData);

    if (matchIds.length == 0) {
        response = {
            success: false,
            error:
                'Not enough data. Play at least 10 ranked Solo Queue to be eligible for advanced stats.',
        };

        return response;
    }

    const dataList: IMatchData[] = [];
    for (let i = 0; i < matchIds.length; ++i) {
        const newData: IMatchData = { matchInfo: matchIds[i] };
        const matchData: ApiResponseDTO<MatchDto> = await lolApi.Match.get(
            matchIds[i].gameId,
            accountData.region
        );
        const playerInfos: MatchParticipantDTO = fetchUserInfos(
            accountData,
            matchData
        );

        // Raw values
        newData.kills = playerInfos.stats.kills;
        newData.deaths = playerInfos.stats.deaths;
        newData.assists = playerInfos.stats.assists;
        newData.totalMinionsKilled = playerInfos.stats.totalMinionsKilled;
        newData.totalDamageDealt = playerInfos.stats.totalDamageDealt;
        newData.totalHeal = playerInfos.stats.totalHeal;
        newData.longestTimeSpentLiving =
            playerInfos.stats.longestTimeSpentLiving;
        newData.visionScore = playerInfos.stats.visionScore;
        newData.visionWardsBoughtInGame =
            playerInfos.stats.visionWardsBoughtInGame;
        newData.goldEarned = playerInfos.stats.goldEarned;
        newData.champLevel = playerInfos.stats.champLevel;
        newData.turretKills = playerInfos.stats.turretKills;
        newData.inhibitorKills = playerInfos.stats.inhibitorKills;

        // Processed values
        newData.gameDuration = matchData.response.gameDuration / 60;
        newData.win = fetchMatchResult(
            matchData.response.teams,
            playerInfos.teamId
        );
        newData.levelPerMinutes =
            Math.round((newData.champLevel / newData.gameDuration) * 10) / 10;
        newData.csPerMinutes =
            Math.round(
                (newData.totalMinionsKilled / newData.gameDuration) * 10
            ) / 10;

        // Assign to data structure
        dataList.push(newData);
    }

    // Processed advanced data
    response = { ...calcAverage(dataList) };
    response['kda'] = calcAverageKda(response);
    response['role'] = getDataMostOccurences(dataList, 'lane');

    const preferedChamp = await lolApi.DataDragon.getChampion(
        parseInt(getDataMostOccurences(dataList, 'champion'))
    );
    response['preferedChampion'] = preferedChamp.name;

    return response;
}

export const getLolStats = async (
    lolSummonerName: string,
    // tslint:disable-next-line: no-any
    lolRegion: any,
    user: User
) => {
    // Stats v1
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
    const response: Object = {
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
        region: lolRegion,
    };

    response['advancedStats'] = await statsv2(accountData);

    return response;
};
