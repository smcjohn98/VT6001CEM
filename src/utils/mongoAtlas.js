import * as Realm from "realm-web";

const app = new Realm.App({ id: "data-wqxbe" });
const credentials = Realm.Credentials.anonymous();
let user = null;

export const authorization = async () => {
    try {
        user = await app.logIn(credentials);
        console.log(user)
    } catch (err) {
        console.error("Failed to log in", err);
    }
}

export const saveRecordToMongoAtlas = async (data) => {
    if (!user) {
        authorization();
    }
    return await app.currentUser.mongoClient("Cluster0").db("sport_trainer").collection("statistics").insertOne({
        ...data,
        completedAt: { "$date": { "$numberLong": (new Date()).getTime() + '' } }
    })
}

export const DAY_AGGREGATION = 0;
export const MONTH_AGGREGATION = 1;
export const YEAR_AGGREGATION = 2;

export const getAggregationRecord = async (userId, aggregation = DAY_AGGREGATION) => {
    if (!user) {
        authorization();
    }

    let format = "%Y-%m-%d";
    if (aggregation === MONTH_AGGREGATION)
        format = "%Y-%m";
    else if (aggregation === YEAR_AGGREGATION)
        format = "%Y";

    let queryObject = [
        {
            $match: {
                userId: userId
            }
        },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: format,
                            date: "$completedAt"
                        }
                    },
                    pose: "$pose"
                },
                count: {
                    $sum: "$count"
                }
            }
        }
    ];

    if(aggregation === DAY_AGGREGATION){
        queryObject[0]['$match']['completedAt'] = {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
    }
    else if(aggregation === MONTH_AGGREGATION){
        queryObject[0]['$match']['completedAt'] = {
            $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
        }
    }

    return await app.currentUser.mongoClient("Cluster0").db("sport_trainer").collection("statistics").aggregate(queryObject)

}