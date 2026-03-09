import { Injectable, inject } from '@angular/core';

import { AssetsService as GeneratedAssetsService } from '../../api-client/api/assets.service';
import { Asset } from '../../api-client/model/asset';
import { AssetStatus } from '../../api-client/model/assetStatus';

export type { Asset, AssetStatus };

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private generatedAssetsService = inject(GeneratedAssetsService);

  getAssets() {
    return this.generatedAssetsService.assetsGet();
  }

  getAssetById(id: string) {
    return this.generatedAssetsService.assetsIdGet(id);
  }

  getAssetStatus(id: string) {
    return this.generatedAssetsService.assetsIdStatusGet(id);
  }

  createAsset(asset: Asset) {
    return this.generatedAssetsService.assetsPost(asset);
  }

  updateAsset(id: string, asset: Asset) {
    return this.generatedAssetsService.assetsIdPut(id, asset);
  }

  deleteAsset(id: string) {
    return this.generatedAssetsService.assetsIdDelete(id);
  }
}