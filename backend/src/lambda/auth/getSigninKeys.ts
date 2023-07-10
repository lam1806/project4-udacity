import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

async function getSigninKeys(keys : any, kid : any) {
    console.log("keys:", keys, "kid:", kid);
    const signinKeys = keys
        .filter(key => key.use === 'sig' && key.kty === 'RSA' && key.kid && ((key.x5c && key.x5c.length) || (key.n && key.e)))
        .map(key => {
          return {
            kid: key.kid,
            nbf: key.nbf,
            publicKey: createCertToPEM(key.x5c[0])
          };
        });
  
    if (!signinKeys) {
      logger.error("Error get signin keys");
      throw new Error('Error get signin keys');
    }
  
    const signingKey = signinKeys.find(key => key.kid === kid);
  
    if (!signingKey) {
      logger.error(`Signing key not found '${kid}'`);
      throw new Error(`Signing key not found '${kid}'`);
    }
  
    return signingKey.publicKey;
  }

  function createCertToPEM(cert) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
  }

  export default getSigninKeys