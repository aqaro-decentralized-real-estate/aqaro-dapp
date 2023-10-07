import { defineStore } from 'pinia'
import {axiosAuthInstance, axiosFormDataInstance, axiosInstance} from "@/lib/http/axios.client";

export const propertyStore = defineStore('properties', {
    state: () => ({
        properties: <any>[],
        createdProperty: <any>{},
    }),
    actions: {
        async listPropertyService(dto: FormData) {
            return await axiosFormDataInstance.post('/property/create' , dto);
        },
        async updatePropertyService(dto: any) {
            return await axiosAuthInstance.post('/property/update' , dto);
        },
        addProperty(property: any) {
            this.properties.push(property);
        },
        async setCreatedProperty(property: any) {
            this.createdProperty = property;
        },
        async getProperty(id: string) {
            return await axiosInstance.get(`/property/get-by-id/${id}`);
        },
        async getPropertyThumbnail(sc_id: string) {
            return await axiosInstance.get(`/property/get-thumbnail/${sc_id}`);
        }
    },
    getters: {
        getProperties: (state) => state.properties,
        getCreatedProperty: (state) => state.createdProperty,
    },
})
