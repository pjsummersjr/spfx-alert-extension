import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';

import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';
import * as strings from 'SiteAlertNotificationApplicationCustomizerStrings';

import { AlertNotification, IAlertNotificationProps } from './components/AlertNotifications';
import { NotificationContainer, INotificationContainerProps } from './components/NotificationContainer';

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

export interface ISiteAlertMessage {
  NotificationLevel: string;
  NotificationMessage: string;
  StartDateTime: Date;
  EndDateTime: Date;
  MoreInformationLink: string;
}

/** 
 * A Custom Action which can be run during execution of a Client Side Application 
 **/
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

    this._getCurrentNotification()
    .then((notificationMessages) => {
      if(notificationMessages) {
        console.log(`Notification found: ${notificationMessages[0].NotificationMessage}`);
        return notificationMessages;        
      }
      else {
        console.log('No notifications found. Returning nothing.');
        return undefined;
      }
    })
    .then((notifications: ISiteAlertMessage[]): void => {
      if(notifications && notifications.length > 0) {
        if(this._topPlaceHolder.domElement) {
          const notificationEl: React.ReactElement<INotificationContainerProps> = React.createElement(
              NotificationContainer,
              {
                messages: notifications
              }
          );         
          ReactDom.render(notificationEl,this._topPlaceHolder.domElement);
        }
      }
      else {
        console.log(`No notifications found. Not rendering header`);
      }
    });

        
  }

  private _getCurrentNotification(): Promise<ISiteAlertMessage[]> {

    let currentDateTime: string = new Date().toISOString();
    let requestUrl = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('Notifications')/items?$filter=StartDate le datetime'${currentDateTime}' and EndDateTime ge datetime'${currentDateTime}'&$select=NotificationMessage,NotificationLevel,StartDate,EndDateTime,MoreInformationLink&$orderby=Created desc`;

    return this.context.spHttpClient.get(
      requestUrl, SPHttpClient.configurations.v1
    ).then((res: SPHttpClientResponse): Promise<{value: ISiteAlertMessage[]}> => {
      return res.json();
    }).then((res: {value: ISiteAlertMessage[]}): ISiteAlertMessage[] => {
      return res.value;
    });
  }

  private _onDispose(): void {
    console.log('[SiteAlertNotification._onDispose] Disposed custom top and bottom placeholders.');
  }
}
