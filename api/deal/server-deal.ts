import { serverApiClient } from "@/api/server-fetch";
import { Action, DealAuditEntry, DealAuditResponse } from "@/types/deal";

export interface DealDetailData {
    id: string;
    clientId: string;
    contactId: string;
    title: string;
    value: number;
    probability: number;
    closeDate: string;
    note?: string;
    stage: string;
    stageOrder: number;

    pipeline?: {
        id: string;
        stages: {
            _id: string;
            name: string;
            displayName: string;
            order: number;
            color: string;
        }[];
    };
    actions:Action[]
}

export interface DealDetailResponse {
    status?: boolean;
    data?: DealDetailData;
    message?: string;
}
export async function getDealDetail(id: string): Promise<DealDetailResponse> {
    try {
        const response = await serverApiClient.get<DealDetailData>(
            `/deals/details/${id}`
        );

        if (response) {
            return {
                status: true,
                data: response,
            };
        }

        return {
            status: false,
            message: "Deal not found",
        };
    } catch (error) {
        console.error("Error fetching Deal detail:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to fetch Deal",
        };
    }
}


export async function getDealAudit(id: string): Promise<DealAuditResponse> {
    try {
        const response = await serverApiClient.get<DealAuditResponse>(
            `/deals/audit/${id}`
        );

        if (response && response.status) {
            return response;
        }

        return {
            status: false,
            message: "Failed to fetch audit",
            data: [],
        };
    } catch (error) {
        console.error("Error fetching Deal audit:", error);
        return {
            status: false,
            message: error instanceof Error ? error.message : "Failed to fetch audit",
            data: [],
        };
    }
}