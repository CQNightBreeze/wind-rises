import { apiManage, WindApis, swagger } from "./lib/api";
import { Request, Response, NextFunction, RequestHandler, Express, ErrorRequestHandler } from "express";
import * as express from "express";

declare global {
    namespace Wind {
        interface Auth {

        }
        interface MAuth {

        }
    }
}


interface Req extends Request {
    auth: Wind.Auth
    mauth: Wind.MAuth
}

interface Res extends Response {

}


interface WindOption {
    config: { [key: string]: any },
    before?: (app: Express) => void,
    security: {
        [key: string]: (req: Req, res: Res, next: NextFunction) => Promise<any>
    },
    apis: {
        [key: string]: WindApis
    },
    handles: {
        [key: string]: (req: Req, res: Res) => Promise<any>
    }
    after?: (app: Express) => void
}



async function wind(option: WindOption) {
    const app = express();
    let { config, before, security = {}, apis, handles, after } = option;
    const { host = "0.0.0.0", port = 3000 } = config;

    if (before) before(app);

    // 解析body
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use((req: Request, res: Response, next: NextFunction) => {
        next();
    });

    await apiManage(app, security, apis, handles, config);
    if (after) after(app);

    app.listen(port, `${host}`);

    console.info(`wind-rises start host:${host} prot:${port}`);

    return { swagger };
}


export { Req, Res, NextFunction, RequestHandler, Express, ErrorRequestHandler, WindOption, WindApis, wind };

