const Elasticsearch = require('elasticsearch')
const path = require('path')
const jsonFile = './data/cities.json'
const indexName = 'test2'
const typeName = '_doc'

const cities = require(jsonFile)
const elasticClient = new Elasticsearch.Client({ host: process.env.ELASTIC_IP })

const client = require('./db')

elasticClient.ping({ requestTimeout: 60000 }, (err) => {
    if (err) {
        console.log('Elastic search is down!')
        return
    }
    console.log('Elastc search is ready to run!')
})

let body = {
    "settings": {
        "analysis": {
            "filter": {
                "my_ascii_folding": {
                    "type": "asciifolding",
                    "preserve_original": true
                }
            },
            "analyzer": {
                "turkish_analyzer": {
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "my_ascii_folding"
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "mahalle_ad": {
                "type": "text",
                "analyzer": "turkish_analyzer"
            },
            "cadde_so_1": {
                "type": "text",
                "analyzer": "turkish_analyzer"
            },
            "adi_numara": {
                "type": "text",
                "analyzer": "turkish_analyzer"
            }
        }
    }
}

const connectDB = async () => {
    const result = await client.connect()
    console.log("connected to DB")
    return result
}
const getMahalleData = async () => {
    let result = await client.query('SELECT mahalle_ad from bey_mahalle')
    return result.rows
}
const getSokakData = async () => {
    let result = await client.query('SELECT cadde_so_1 from bey_sokak')
    return result.rows
}
const getBinaData = async () => {
    let result = await client.query('SELECT adi_numara from bey_kapino')
    return result.rows
}
const createIndex = async () => {
    return await elasticClient.indices.create({ index: indexName, body })
}

let bulk = []
const bulkIndex = async (result) => {
    result.forEach(res => {
        bulk.push({
            index: {
                _index: indexName,
                _type: typeName
            }
        })
        bulk.push(res)
    })
}

(async () => {
    try {
        await connectDB()
        let mahalle = await getMahalleData()
        let sokak = await getSokakData()
        let bina = await getBinaData()
        await createIndex()
        await bulkIndex(mahalle)
        await bulkIndex(sokak)
        await bulkIndex(bina)
        await elasticClient.bulk({ body: bulk })
        client.end()
    } catch (error) {
        console.log(error)
    }
})()




