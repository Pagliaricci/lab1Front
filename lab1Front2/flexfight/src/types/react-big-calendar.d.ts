declare module 'react-big-calendar' {
    import { ComponentType } from 'react';

    export interface Event {
        title: string;
        start: Date;
        end: Date;
        allDay?: boolean;
    }

    export interface CalendarProps {
        events: Event[];
        startAccessor: string | ((event: Event) => Date);
        endAccessor: string | ((event: Event) => Date);
        localizer: any;
        style?: React.CSSProperties;
    }

    export const Calendar: ComponentType<CalendarProps>;
    export function momentLocalizer(momentInstance: any): any;
}
