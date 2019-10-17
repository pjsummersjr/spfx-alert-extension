import * as React from 'react';

import {ISiteAlertMessage} from '../SiteAlertNotificationApplicationCustomizer';
import { AlertNotification } from './AlertNotifications';
import styles from './AlertNotificationStyles.module.scss';

export interface INotificationContainerProps {
    messages: ISiteAlertMessage[];
}

export interface INotificationState {
    messages: ISiteAlertMessage[];
    activeMessage: ISiteAlertMessage;
    activeIndex: number;
}

export class NotificationContainer extends React.Component<INotificationContainerProps,INotificationState> {

    private _this = this;
    constructor(props, state) {
        super(props);
        this.state = {
            messages: this.props.messages,
            activeIndex: 0,
            activeMessage: this.props.messages && this.props.messages.length > 0 ? this.props.messages[0] : undefined
        };
        this.getNextState.bind(this);
        this.getPreviousState.bind(this);
    }

    private getNextState(): boolean {
        return (this.state.activeIndex < (this.state.messages.length - 1));
    }

    private getPreviousState(): boolean {        
        return (this.state.activeIndex > 0);
    }

    private moveNext(): void {
        let newIndex: number = this.state.activeIndex + 1;
        
        if(newIndex <= this.state.messages.length - 1) {
            this.setState(
                {
                    activeIndex: newIndex, 
                    activeMessage: this.state.messages[newIndex]
                }
            );
        }
    }

    private movePrevious(): void {
        if(this.state.activeIndex <= 0){return;}
        this.setState(
            {
                activeIndex: this.state.activeIndex - 1, 
                activeMessage: this.state.messages[this.state.activeIndex-1]
            }
        );
    }

    public render(): React.ReactElement<INotificationContainerProps> {
        if(this.state.activeMessage) {
            let hasPrevious = this.getPreviousState();
            let hasNext = this.getNextState();
            console.log(`Messages: ${this.state.messages.length} Active Index: ${this.state.activeIndex} Previous: ${hasPrevious ? "true" : "false"} Next: ${hasNext ? "true" : "false"}`);
            return (
                <div className={styles.app}>
                    <div className={styles.notificationContainer}>
                        <button className={styles.navButton + ' ' + styles.navButtonPrevious} 
                            onClick={this.movePrevious.bind(this)} 
                            disabled={!hasPrevious}
                            hidden={!hasPrevious}>{'<<'}</button>
                        <AlertNotification className={styles.navButtonPrevious} alert={this.state.activeMessage}></AlertNotification>
                        <button className={styles.navButton} onClick={this.moveNext.bind(this)} 
                            disabled={!hasNext}
                            hidden={!hasNext}>{'>>'}</button>
                    </div>
                </div>
            );
        }
        else {
            return undefined;
        }
    }

}