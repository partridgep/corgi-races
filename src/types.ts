export type QueryParams = {
    id?: string;
    num?: number;
    page?: number,
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

export type Pagination = {
    currentPage: number,
    pageSize: number,
    totalPages: number,
    totalRecords: number,
}