import * as React from 'react';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { ISiteAlertMessage } from '../SiteAlertNotificationApplicationCustomizer';
import styles from './AlertNotificationStyles.module.scss';

export interface IAlertNotificationProps {
    alert: ISiteAlertMessage;
    className: string;
}

export class AlertNotification extends React.Component<IAlertNotificationProps, {}> {

    public render(): React.ReactElement<IAlertNotificationProps> {

        let messageBarClass = `${styles.notificationComp}`;
        if (this.props.className) messageBarClass += ` ${this.props.className}`;
        if (this.props.alert.NotificationLevel == "Notification") messageBarClass += ` ${styles.notification}`;
        if (this.props.alert.NotificationLevel == "Emergency") messageBarClass += ` ${styles.emergency}`;
        if( this.props.alert.NotificationLevel == "Warning") messageBarClass += ` ${styles.warning}`;

        return (            
            <div className={messageBarClass}>
                <span>
                    {this.props.alert.NotificationMessage}
                    &nbsp;&nbsp;
                    {this.props.alert.MoreInformationLink ? <a href={this.props.alert.MoreInformationLink}>More...</a> : ''}
                </span>                
            </div>            
        );
    }
}