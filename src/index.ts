

import * as Koa from "koa";
import { SwaggerDefalut, apiManage, TravelApis, swagger } from './lib/api'
import * as  bodyparser from 'koa-bodyparser';
import * as json from 'koa-json';
import * as http from 'http';
import chalk from 'chalk';
import { srvsCode, Code } from './lib/code'

type TravelConfig<T> = {
    host?: String,
    port: number,
} & T


type Args = {
    apis: {
        [key: string]: TravelApis
    },
    controllers: {
        [key: string]: (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) => Promise<any>
    }
}

type TravelOption = {
    config: TravelConfig<any>,
    before?: (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => void,
    args: Args,
    srvs?: {
        [key: string]: any
    },
    swaggerDefalut?: SwaggerDefalut,
    after?: (app: Koa<Koa.DefaultState, Koa.DefaultContext>, obj: object) => void
}


export async function travel(option: TravelOption) {
    const app = new Koa()
    let { config, before, args, swaggerDefalut, after, srvs } = option
    const { host = '0.0.0.0', port = '3000' } = config
    const { apis, controllers } = args
    
    srvs = srvsCode(srvs)
    
    if (before) before(app)
    app.use(bodyparser({
        enableTypes: ['json', 'form', 'text']
    }))
    app.use(async (ctx, next) => {
        ctx.srvs = srvs
        await next()
    })
    app.use(json({}))
    await apiManage(app, apis, controllers, swaggerDefalut, config)
    if (after) after(app, { swagger })

    app.listen(port, `${host}`)

    console.log(chalk.bold.red(`\ntravel start host:${host} prot:${port}`))
    
}


type App = Koa<Koa.DefaultState, Koa.DefaultContext>

type Ctx = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>


declare global {
    namespace Travel {
        interface Srvs {
            [k: string]: any;
        }
        interface $config {

        }
    }
}


interface TravelCtx extends Ctx {
    srvs: Travel.Srvs
    $config: Travel.$config
}


interface TravelApp extends App {
    srvs: Travel.Srvs
    $config: Travel.$config
}


export { TravelApis, TravelOption, App, Ctx, TravelCtx, TravelApp,Code }