export interface ISearchCrtieria {
    region: string;
    startYear: number;
    endYear: number;
    maxMileage: number;
    maxPrice: number;
    exteriorCondition: string;
    mechanicalCondition: string;
    color: string;
    make: string;
    model: string;
};

export type SearchCriteriaBody = Partial<ISearchCrtieria>;

export interface IAddJobResult {
    jobId: string;
    criteria: SearchCriteriaBody;
}