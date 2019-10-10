import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SiteAlertNotificationApplicationCustomizerStrings';
import styles from './SiteAlertNotification.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

const LOG_SOURCE: string = 'SiteAlertNotificationApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISiteAlertNotificationApplicationCustomizerProperties {
  // This is an example; replace with your own property
  topData: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SiteAlertNotificationApplicationCustomizer
  extends BaseApplicationCustomizer<ISiteAlertNotificationApplicationCustomizerProperties> {

  private _topPlaceHolder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    console.log("Rendering top placeholder data");

    if(!this._topPlaceHolder){
      this._topPlaceHolder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose}
      );
      
      if(!this._topPlaceHolder) {
        console.error("Top placeholder not found. Cancelling operation.");
        return;
      }
    }

    if(this._topPlaceHolder.domElement) {
      this._topPlaceHolder.domElement.innerHTML = `
        <div class="${styles.app}">
          <div class="${styles.top}">Posting a message in the app</div>
        </div>`;
    }
  }

  private _onDispose(): void {
    console.log('[SiteAlertNotification._onDispose] Disposed custom top and bottom placeholders.');
  }
}
