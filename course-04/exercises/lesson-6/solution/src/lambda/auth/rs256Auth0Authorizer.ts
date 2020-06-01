
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJdvuFcVG/U+Z4MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi0teW5sbDVjOC5hdXRoMC5jb20wHhcNMjAwNjAxMTgxODI3WhcNMzQw
MjA4MTgxODI3WjAhMR8wHQYDVQQDExZkZXYtLXlubGw1YzguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzynyR58149vA7RGllWByUv8l
BUJnTBeX1GekUrAL4zM2lK5EPeJoOTzKtje3I6Rx8URW2jVZyZRU/MKD9gIvZHjB
zIYgjU1mCr6howxaX2lsHPOuHG6jOcxOt86Y5OUUWm/fUi3+uo1rzgwykGtqIuML
QEa6wg69LhMbuo6qzY4jGRVARNr3JKCqUNZwloXrEM8xZsy8VJ0GVyaWwrp4R7k4
5IqsODYTwMjL6cMkw/uaYdqYjQOnG2n7FDNEn0dQk9H132t5Aioa5qm6mWqRYgP5
XZ/JV2ADTVvaFXfgoCkNdSxqx3k8y8i/tLe01RZleXkYOl8uf6kgVr61QlmPKQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRCo3dwc5o6E3RtI3g5
IQMO84y2NTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBALFcewuY
40+2gjd++WjPQmYFBWe2RHGeGpIJYNc3xgEaBqR3EZyUlH5DN3cNHib5PRunKL2m
yqXMEgGC434WpU4TOfd8A09jwO82yvwX+1pFgwNcgOCxH38gDU75OV2ZDFyRIv37
Ba2HISJ9e6g6OVelw+7D4fiXIRj0aENELs0VboW0gzWk7TJdwM0mLoJH6DKLOYKd
kDVb1Efw18Pyu/UlD2zWjnp1wTNQuV4HFIkguYjDEK3lIRNZg6yPG/TbvrhUqTp1
d7DWq3kmfuGPdCT6N/ed8hvEtwj+rJw5J6gvFj3nhGqBuTcCVA0Mc6/ebpUqPsqU
LyrNBhrpAaTqghg=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
