export type QueryParams = {
    id?: string;
    num?: number;
    startTime?: string;
    endTime?: string;
    asc?: boolean;
    longitude?: number;
    latitude?: number;
};

export type UrlParams = QueryParams & {
    closest?: boolean
};

export type Coordinates = {
    latitude: number;
    longitude: number;
}