import * as ts from 'typescript';

export class ModuleResolutionCache {
  private _cache: {
    [containingFile: string]: {
      [moduleName: string]: ts.ResolvedModule;
    };
  } = {};

  getCache(moduleName: string, containingFile: string): ts.ResolvedModule | undefined {
    if (!this._cache[containingFile]) {
      if (containingFile.endsWith('.wpy')) {
        this._cache[containingFile] = this._cache[containingFile + '.template'] = {};
      } else if (containingFile.endsWith('.wpy.template')) {
        this._cache[containingFile.slice(0, -'.template'.length)] = this._cache[containingFile] = {};
      } else {
        this._cache[containingFile] = {};
      }
      return undefined;
    }

    return this._cache[containingFile][moduleName];
  }

  setCache(moduleName: string, containingFile: string, cache: ts.ResolvedModule) {
    if (!this._cache[containingFile]) {
      if (containingFile.endsWith('.wpy')) {
        this._cache[containingFile] = this._cache[containingFile + '.template'] = {};
      } else if (containingFile.endsWith('.wpy.template')) {
        this._cache[containingFile.slice(0, -'.template'.length)] = this._cache[containingFile] = {};
      } else {
        this._cache[containingFile] = {};
      }
      return undefined;
    }

    this._cache[containingFile][moduleName] = cache;
  }
}
