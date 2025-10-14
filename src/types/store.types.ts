export interface RegisterStoreRequest {
    storeName: string
    description?: string | null
    storeLogoFileId: string
    address: string
}

export interface RegisterStoreResponse {
    StoreId: string
    StoreName: string
    StoreDescription: string | null
    StoreLogo: string
    StoreAddress: string
}