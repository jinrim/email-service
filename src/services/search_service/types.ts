export interface ISearchParams {
  type?: string;
  entities?: any;
  database?: string;
  search?: Array<string>;
  metadata?: Record<string, Array<any>>;
  metadata_attribute?: Record<string, any>;
  order?: any;
  size: number;
  enable_matched_text?: boolean;
  enable_return_all_fields?: boolean;
  enable_transform_response?: boolean;
  enable_list?: boolean;
  pre_tags?: string;
  post_tags?: string;
  advance_filter?: IFilterCriteria[];
  is_or?: boolean;
  allow_space_in_search_term?: boolean;
}

export interface IFilterCriteria {
  is_id?: boolean;
  column: string;
  operator: string; //'equal' | 'contains' | 'starts_with' | 'is_between';
  values?: Array<number | string | boolean>;
}

export interface ISearchResults {
  success?: boolean;
  message?: string;
  count?: number;
  data?: {
    [key: string]: {
      count: number;
      results: Record<string, any>[];
    };
  };
}
