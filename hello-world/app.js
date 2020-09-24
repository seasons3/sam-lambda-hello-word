const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'hello world',
        })
    };

    return response;
};

exports.addName = async (event, context) => {
    let response;
    const { name } = JSON.parse(event.body);
    const id = Buffer.from(name).toString('base64');

    const params = {
        TableName: 'Names',
        Item: {
            id,
            name
        }
    };

    try {
        await db.put(params).promise();
        response = {
            statusCode: 201,
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: err.message })
        };
    }

    return response;
}

exports.greetNames = async (event, context) => {
    let response;

    try {
        const names = (await db.scan({ TableName: 'Names' }).promise())
            .Items.map((item) => item.name);

        response = {
            statusCode: 200,
            body: JSON.stringify({ message: `hello ${names}` })
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            })
        }
    }

    return response;
}