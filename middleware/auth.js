import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = !token.startsWith("ya29.");

        let decodedData;

        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.secretToken)
            
            req.userId = decodedData?.id;

        } else {
            
            await axios.get('https://www.googleapis.com/userinfo/v2/me', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then(response => {
              const result = response.data;
              try {
                req.userId = result?.id;
            } catch (error) {
                console.log(error);
            }
            })
            .catch(error => {
                console.error(error);
            });
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;