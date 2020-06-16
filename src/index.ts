import fs from 'fs';
import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions } from '@verdaccio/types';
import { Application } from 'express';

import { CustomConfig } from '../types/index';

export default class VerdaccioMiddlewarePlugin implements IPluginMiddleware<CustomConfig> {
  public logger: Logger;
  public foo: string;
  public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {
    this.foo = config.foo !== undefined ? config.strict_ssl : true;
    this.logger = options.logger;
  }

  public register_middlewares(
    app: Application,
    auth: IBasicAuth<CustomConfig>,
    /* eslint @typescript-eslint/no-unused-vars: off */
    _storage: IStorageManager<CustomConfig>
  ): void {
    const logFilePath = '/tmp/verdaccio.middleware.log';
    app.use((req, res, next) => {
      const msg = `
      ==========================================================
      url: ${req.url},
      params: ${JSON.stringify(req.params)},
      headers: ${JSON.stringify(req.headers)},
      body: ${JSON.stringify(req.body)}
      typeof body: ${typeof req.body}
      ==========================================================
      `;
      fs.appendFileSync(logFilePath, msg);
      next();
    });
    fs.appendFileSync(logFilePath, 'VerdaccioExamplePlugin is registered');
  }
}
