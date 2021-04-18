

import { ManageApis, Handles, WindApis } from "./api";

export function apiVerify(apis: ManageApis, controllers: Handles) {
    let verifyPath = {};
    let verifyOperationId = {};
    Object.keys(apis).forEach(apiItem => {
        const items = apis[apiItem];
        items.forEach(item => {
            const { path, method, operationId } = item;
            if (!verifyPath[path]) {
                verifyPath[path] = {};
            }
            if (!verifyPath[path][method]) {
                verifyPath[path][method] = operationId;
            } else {
                throw `路径==>${path}的请求方法${method} 已经存在`;
            }
        });
    });

    Object.keys(controllers).forEach(data => {
        if (!verifyOperationId[data]) {
            verifyOperationId[data] = controllers[data];
        } else {
            throw `逻辑处理方法${data} already exist`;
        }
    });


}