import 'source-map-support/register'
import { getAllGroups } from '../../businessLogic/groups';

import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

const app = express()



app.get('/groups', async (_req, res) => {
  const groups = await getAllGroups()

  res.header("Access-Control-Allow-Origin" , "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.json({
    items: groups
  })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
