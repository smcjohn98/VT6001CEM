import axios from 'axios';
axios.defaults.baseURL = "https://us-east-1.aws.data.mongodb-api.com/app/data-wqxbe/endpoint/data/v1";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['api-key'] = 'cPCEO5L9u7aZW4BEqUNriS6MMopTq7WYsBeKrqkfq9VT36nLfZ314RWFLbhZSOMM';

export const getToken = () => {
    axios.post(`https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/data-wqxbe/auth/providers/api-key/login`, 
    {key : "cPCEO5L9u7aZW4BEqUNriS6MMopTq7WYsBeKrqkfq9VT36nLfZ314RWFLbhZSOMM"} )
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error);
      });
}

export const saveRecordToMongoAtlas = (data) => {
    let requestBody = {
        dataSource: 'Cluster0',
        database: 'sport_trainer',
        collection: 'statistics',
        document: {
          ...data,
          completedAt: { "$date": { "$numberLong": (new Date()).getTime() } }
        }
    }

    axios.post(`/action/insertOne`, requestBody )
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error);
      });
}

export const getRecordToMongoAtlas = (data, aggregation) => {
    
}