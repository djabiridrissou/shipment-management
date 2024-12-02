import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FetchFilesParams {
  page: number;
  limit: number;
}

interface ApiResponse {
  data: any[];
  pagination: any;
}

interface TransformedResponse {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
  };
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:1220/api/",
  }),
  tagTypes: ['Files'],
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['Files'],
    }),

    fetchFiles: builder.query<TransformedResponse, FetchFilesParams>({
      query: ({ page, limit }) => ({
        url: `all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse) => ({
        data: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          totalCount: response.pagination.totalCount,
        },
      }),
      providesTags: ['Files'],
    }),
    fetchOne: builder.query({
      query: (id) => ({
        url: `one?id=${id}`,
        method: "GET",
      }),
    }),
    deleteOne: builder.mutation({
      query: (id) => ({
        url: `delete?id=${id}`,
        method: "DELETE",
      }),
    })
  }),
});

export const { useUploadFilesMutation, useFetchFilesQuery, useFetchOneQuery, useDeleteOneMutation  } = apiSlice;